const http = require('http');

async function fixFormIssue() {
  console.log('🔧 Fixing "Feedback form not found" issue...\n');
  
  try {
    // Step 1: Create/verify admin user
    console.log('Step 1: Creating admin user...');
    await createAdminUser();
    
    // Step 2: Login and get token
    console.log('\nStep 2: Logging in...');
    const token = await loginUser();
    
    // Step 3: Create test form
    console.log('\nStep 3: Creating test feedback form...');
    const formData = await createTestForm(token);
    
    console.log('\n🎉 SUCCESS! Issue fixed!');
    console.log('\n📋 DETAILS:');
    console.log('✓ Admin user: adarsh');
    console.log('✓ Password: adarsh123');
    console.log(`✓ Form ID: ${formData.id}`);
    console.log(`✓ Form Title: ${formData.title}`);
    
    console.log('\n🌐 WORKING STUDENT FORM URL:');
    console.log(`http://localhost:3000/#/student/${formData.id}`);
    
    console.log('\n📝 ADMIN PANEL URL:');
    console.log('http://localhost:3000/#/admin-login');
    console.log('Login with username: adarsh, password: adarsh123');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Make sure backend server is running on port 8001');
    console.error('2. Check if MongoDB is connected');
    console.error('3. Verify no firewall blocking localhost:8001');
  }
}

// Create admin user
async function createAdminUser() {
  const userData = {
    username: 'adarsh',
    email: 'adarsh@mvit.edu.in',
    password: 'adarsh123',
    role: 'admin'
  };
  
  const postData = JSON.stringify(userData);
  
  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log('  ✅ Admin user created successfully');
          resolve();
        } else if (res.statusCode === 400) {
          const response = JSON.parse(data);
          if (response.detail === 'Username already exists') {
            console.log('  ✅ Admin user already exists');
            resolve();
          } else {
            reject(new Error(response.detail));
          }
        } else {
          reject(new Error(`Failed to create user: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Login user and get token
async function loginUser() {
  const loginData = JSON.stringify({
    username: 'adarsh',
    password: 'adarsh123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log('  ✅ Login successful');
          resolve(response.access_token);
        } else {
          reject(new Error(`Login failed: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

// Create test feedback form
async function createTestForm(token) {
  const formData = {
    title: 'Student Feedback Form - Test',
    year: '2024-25',
    section: 'A',
    department: 'Computer Science',
    subjects: [
      'Data Structures',
      'Computer Networks', 
      'Database Management',
      'Software Engineering',
      'Operating Systems'
    ],
    evaluation_criteria: [
      'Teaching Effectiveness',
      'Subject Knowledge',
      'Communication Skills',
      'Course Material Quality',
      'Student Interaction',
      'Assignment & Assessment',
      'Punctuality',
      'Overall Rating'
    ]
  };
  
  const postData = JSON.stringify(formData);
  
  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/api/forms',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log('  ✅ Test feedback form created successfully');
          resolve(response);
        } else {
          reject(new Error(`Failed to create form: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Check if server is running
async function checkServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8001/health', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend server is running\n');
        resolve();
      } else {
        reject(new Error(`Server health check failed: ${res.statusCode}`));
      }
    });
    
    req.on('error', () => {
      reject(new Error('Backend server is not running on port 8001'));
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Server health check timeout'));
    });
  });
}

// Main execution
async function main() {
  try {
    await checkServer();
    await fixFormIssue();
  } catch (error) {
    console.error('💥 Fix failed:', error.message);
    
    if (error.message.includes('not running')) {
      console.log('\n🚀 To start the backend server:');
      console.log('1. Open new terminal');
      console.log('2. cd "C:\\Users\\shrut\\Desktop\\HOD Project\\Students-Feedback-System\\backend"');
      console.log('3. npm run dev');
    }
    
    process.exit(1);
  }
}

main();