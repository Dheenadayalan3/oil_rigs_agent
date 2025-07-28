import { 
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand 
} from '@aws-sdk/client-dynamodb';
import { 
  TimestreamWriteClient,
  WriteRecordsCommand 
} from '@aws-sdk/client-timestream-write';
import { 
  TimestreamQueryClient,
  QueryCommand as TimestreamQueryCommand 
} from '@aws-sdk/client-timestream-query';
import { 
  S3Client,
  PutObjectCommand,
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { 
  LambdaClient,
  InvokeCommand 
} from '@aws-sdk/client-lambda';

// AWS Configuration
const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
};

// Initialize AWS Clients
export const dynamoClient = new DynamoDBClient(awsConfig);
export const timestreamWriteClient = new TimestreamWriteClient(awsConfig);
export const timestreamQueryClient = new TimestreamQueryClient(awsConfig);
export const s3Client = new S3Client(awsConfig);
export const lambdaClient = new LambdaClient(awsConfig);

// AWS Service Names
export const AWS_SERVICES = {
  DYNAMODB_TABLE: import.meta.env.VITE_AWS_DYNAMODB_TABLE || 'pump-sensor-data',
  TIMESTREAM_DATABASE: import.meta.env.VITE_AWS_TIMESTREAM_DATABASE || 'PumpMonitoring',
  TIMESTREAM_TABLE: import.meta.env.VITE_AWS_TIMESTREAM_TABLE || 'SensorReadings',
  S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET || 'pump-maintenance-reports',
  LAMBDA_FUNCTION: import.meta.env.VITE_AWS_LAMBDA_FUNCTION || 'pump-anomaly-processor'
};