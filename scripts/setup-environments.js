#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ADMIN_SECRET'
];

const OPTIONAL_VARS = [
  'TWILIO_SID',
  'TWILIO_AUTH',
  'TWILIO_PHONE',
  'APIFY_DATASET_ID'
];

function validateEnvironment(envFile) {
  console.log(`\n🔍 Validating ${envFile}...`);
  
  if (!fs.existsSync(envFile)) {
    console.log(`❌ ${envFile} not found`);
    return false;
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  // Parse env file
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#\s][^=]*?)=(.*)$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  });

  // Check required variables
  let isValid = true;
  REQUIRED_VARS.forEach(varName => {
    if (!envVars[varName] || envVars[varName].includes('your_')) {
      console.log(`❌ Missing or placeholder: ${varName}`);
      isValid = false;
    } else {
      console.log(`✅ ${varName}`);
    }
  });

  // Check optional variables  
  OPTIONAL_VARS.forEach(varName => {
    if (!envVars[varName] || envVars[varName].includes('your_')) {
      console.log(`⚠️  Not configured: ${varName}`);
    } else {
      console.log(`✅ ${varName}`);
    }
  });

  return isValid;
}

function createSampleEnv() {
  const sampleContent = `# DEVELOPMENT ENVIRONMENT
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key_here

# Development Twilio (can use test credentials)
TWILIO_SID=your_dev_twilio_sid
TWILIO_AUTH=your_dev_twilio_auth_token
TWILIO_PHONE=your_dev_twilio_phone_number

# Development settings
APIFY_DATASET_ID=your_dev_apify_dataset_id
ADMIN_SECRET=dev_admin_secret_123

# Environment indicator
NODE_ENV=development`;

  fs.writeFileSync('.env.local.sample', sampleContent);
  console.log('✅ Created .env.local.sample');
}

function main() {
  console.log('🏗️  Daily Quotes App - Environment Setup');
  
  // Validate local environment
  const localValid = validateEnvironment('.env.local');
  
  // Create sample if needed
  if (!fs.existsSync('.env.local.sample')) {
    createSampleEnv();
  }
  
  console.log('\n📋 Environment Setup Summary:');
  console.log('1. Create dev Supabase project at https://supabase.com/dashboard');
  console.log('2. Update .env.local with dev credentials');
  console.log('3. Run database migration on dev: database/migrations/001_create_subscribers.sql');
  console.log('4. Set production environment variables in Vercel dashboard');
  console.log('5. Run database migration on prod: database/migrations/001_create_subscribers.sql');
  
  if (localValid) {
    console.log('\n✅ Local environment looks good!');
  } else {
    console.log('\n❌ Please fix local environment configuration');
  }
}

main(); 