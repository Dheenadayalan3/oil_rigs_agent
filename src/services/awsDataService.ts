import { 
  dynamoClient, 
  timestreamWriteClient, 
  timestreamQueryClient,
  s3Client,
  lambdaClient,
  AWS_SERVICES 
} from './awsConfig';
import { 
  PutItemCommand,
  QueryCommand,
  ScanCommand 
} from '@aws-sdk/client-dynamodb';
import { WriteRecordsCommand } from '@aws-sdk/client-timestream-write';
import { QueryCommand as TimestreamQueryCommand } from '@aws-sdk/client-timestream-query';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { SensorData, Anomaly, Pump } from '../types';

export class AWSDataService {
  // Store sensor data in Amazon Timestream for time-series analysis
  static async storeSensorData(sensorData: SensorData): Promise<void> {
    try {
      const records = [
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'vibration' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.vibration.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        },
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'temperature' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.temperature.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        },
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'pressure' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.pressure.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        },
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'flowRate' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.flowRate.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        },
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'current' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.current.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        },
        {
          Dimensions: [
            { Name: 'PumpId', Value: sensorData.pumpId },
            { Name: 'Parameter', Value: 'voltage' }
          ],
          MeasureName: 'value',
          MeasureValue: sensorData.voltage.toString(),
          MeasureValueType: 'DOUBLE',
          Time: sensorData.timestamp.toString()
        }
      ];

      const command = new WriteRecordsCommand({
        DatabaseName: AWS_SERVICES.TIMESTREAM_DATABASE,
        TableName: AWS_SERVICES.TIMESTREAM_TABLE,
        Records: records
      });

      await timestreamWriteClient.send(command);
      console.log('Sensor data stored in Timestream');
    } catch (error) {
      console.error('Error storing sensor data:', error);
    }
  }

  // Query historical sensor data from Timestream
  static async getHistoricalData(
    pumpId: string, 
    parameter: string, 
    hoursBack: number = 24
  ): Promise<any[]> {
    try {
      const query = `
        SELECT time, measure_value::double as value 
        FROM "${AWS_SERVICES.TIMESTREAM_DATABASE}"."${AWS_SERVICES.TIMESTREAM_TABLE}"
        WHERE PumpId = '${pumpId}' 
        AND Parameter = '${parameter}'
        AND time >= ago(${hoursBack}h)
        ORDER BY time DESC
      `;

      const command = new TimestreamQueryCommand({ QueryString: query });
      const result = await timestreamQueryClient.send(command);
      
      return result.Rows?.map(row => ({
        timestamp: row.Data?.[0]?.ScalarValue,
        value: parseFloat(row.Data?.[1]?.ScalarValue || '0')
      })) || [];
    } catch (error) {
      console.error('Error querying historical data:', error);
      return [];
    }
  }

  // Store anomalies in DynamoDB
  static async storeAnomaly(anomaly: Anomaly): Promise<void> {
    try {
      const command = new PutItemCommand({
        TableName: AWS_SERVICES.DYNAMODB_TABLE,
        Item: {
          id: { S: anomaly.id },
          pumpId: { S: anomaly.pumpId },
          timestamp: { N: anomaly.timestamp.toString() },
          type: { S: anomaly.type },
          severity: { S: anomaly.severity },
          confidence: { N: anomaly.confidence.toString() },
          description: { S: anomaly.description },
          recommendation: { S: anomaly.recommendation },
          parameters: { SS: anomaly.parameters }
        }
      });

      await dynamoClient.send(command);
      console.log('Anomaly stored in DynamoDB');
    } catch (error) {
      console.error('Error storing anomaly:', error);
    }
  }

  // Get recent anomalies from DynamoDB
  static async getRecentAnomalies(pumpId?: string, limit: number = 50): Promise<Anomaly[]> {
    try {
      let command;
      
      if (pumpId) {
        command = new QueryCommand({
          TableName: AWS_SERVICES.DYNAMODB_TABLE,
          IndexName: 'pumpId-timestamp-index',
          KeyConditionExpression: 'pumpId = :pumpId',
          ExpressionAttributeValues: {
            ':pumpId': { S: pumpId }
          },
          ScanIndexForward: false,
          Limit: limit
        });
      } else {
        command = new ScanCommand({
          TableName: AWS_SERVICES.DYNAMODB_TABLE,
          Limit: limit
        });
      }

      const result = await dynamoClient.send(command);
      
      return result.Items?.map(item => ({
        id: item.id?.S || '',
        pumpId: item.pumpId?.S || '',
        timestamp: parseInt(item.timestamp?.N || '0'),
        type: item.type?.S || '',
        severity: item.severity?.S as any,
        confidence: parseFloat(item.confidence?.N || '0'),
        description: item.description?.S || '',
        recommendation: item.recommendation?.S || '',
        parameters: item.parameters?.SS || []
      })) || [];
    } catch (error) {
      console.error('Error getting anomalies:', error);
      return [];
    }
  }

  // Store maintenance reports in S3
  static async storeMaintenanceReport(
    pumpId: string, 
    report: string, 
    timestamp: number
  ): Promise<string> {
    try {
      const key = `maintenance-reports/${pumpId}/${timestamp}-report.txt`;
      
      const command = new PutObjectCommand({
        Bucket: AWS_SERVICES.S3_BUCKET,
        Key: key,
        Body: report,
        ContentType: 'text/plain',
        Metadata: {
          pumpId,
          timestamp: timestamp.toString(),
          generatedBy: 'agentic-ai-system'
        }
      });

      await s3Client.send(command);
      console.log('Report stored in S3:', key);
      return key;
    } catch (error) {
      console.error('Error storing report:', error);
      throw error;
    }
  }

  // Invoke Lambda function for advanced ML processing
  static async invokeMLProcessing(
    sensorData: SensorData[], 
    anomalies: Anomaly[]
  ): Promise<any> {
    try {
      const payload = {
        sensorData,
        anomalies,
        timestamp: Date.now()
      };

      const command = new InvokeCommand({
        FunctionName: AWS_SERVICES.LAMBDA_FUNCTION,
        Payload: JSON.stringify(payload),
        InvocationType: 'RequestResponse'
      });

      const result = await lambdaClient.send(command);
      const response = JSON.parse(new TextDecoder().decode(result.Payload));
      
      console.log('Lambda processing completed');
      return response;
    } catch (error) {
      console.error('Error invoking Lambda:', error);
      return null;
    }
  }

  // Get pump configuration from DynamoDB
  static async getPumpConfiguration(pumpId: string): Promise<Pump | null> {
    try {
      const command = new QueryCommand({
        TableName: 'pump-configurations',
        KeyConditionExpression: 'id = :pumpId',
        ExpressionAttributeValues: {
          ':pumpId': { S: pumpId }
        }
      });

      const result = await dynamoClient.send(command);
      const item = result.Items?.[0];
      
      if (!item) return null;

      return {
        id: item.id?.S || '',
        name: item.name?.S || '',
        location: item.location?.S || '',
        status: item.status?.S as any,
        efficiency: parseFloat(item.efficiency?.N || '0'),
        operatingHours: parseInt(item.operatingHours?.N || '0'),
        lastMaintenance: item.lastMaintenance?.S || ''
      };
    } catch (error) {
      console.error('Error getting pump configuration:', error);
      return null;
    }
  }
}