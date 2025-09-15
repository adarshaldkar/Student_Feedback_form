const http = require('http');

async function createWorkingForm() {
  console.log('🔧 Creating working feedback form...\n');
  
  try {
    // Step 1: Login with existing admin user
    console.log('Step 1: Logging in with admin user...');
    const token = await loginUser('adarsh', 'adarsh123');
    
    // Step 2: Create test form
    console.log('\nStep 2: Creating test feedback form...');
    const formData = await createTestForm(token);
    
    console.log('\n🎉 SUCCESS! Working form created!');
    console.log('\n📋 FORM DETAILS:');
    console.log(`✓ Form ID: ${formData.id}`);
    console.log(`✓ Form Title: ${formData.title}`);
    console.log(`✓ Department: ${formData.department}`);
    console.log(`✓ Year/Section: ${formData.year} - Section ${formData.section}`);
    
    console.log('\n🌐 WORKING STUDENT FORM URL:');
    console.log(`http://localhost:3000/#/student/${formData.id}`);
    
    console.log('\n📋 COPY THIS LINK AND USE IT IN YOUR BROWSER!');
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    
    if (error.message.includes('Login failed')) {
      console.log('\n🔑 Trying to create admin user first...');
      try {
        await createAdminUser();
        console.log('✅ Admin user created. Now retry the script.');
      } catch (createError) {
        console.log('Admin user might already exist. Trying different credentials...');
        
        // Try common usernames
        const credentials = [
          { username: 'admin', password: 'admin123' },
          { username: 'testadmin', password: 'password123' },
          { username: 'admin1', password: 'password123' }
        ];
        
        for (const cred of credentials) {
          try {
            console.log(`Trying ${cred.username}...`);
            const token = await loginUser(cred.username, cred.password);
            const formData = await createTestForm(token);
            console.log(`\n✅ Success with ${cred.username}!`);
            console.log(`🌐 URL: http://localhost:3000/#/student/${formData.id}`);
            return;
          } catch (e) {
            console.log(`❌ ${cred.username} failed: ${e.message}`);
          }
        }
      }
    }
  }
}

// Login user and get token
async function loginUser(username, password) {
  const loginData = JSON.stringify({ username, password });
  
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
          console.log(`  ✅ Login successful for ${username}`);
          resolve(response.access_token);
        } else {
          reject(new Error(`Login failed for ${username}: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

// Create admin user
async function createAdminUser() {
  const userData = {
    username: 'testadmin',
    email: 'test@mvit.edu.in',
    password: 'password123',
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
          console.log('  ✅ Test admin user created');
          resolve();
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

// Create test feedback form
async function createTestForm(token) {
  const formData = {
    title: 'Student Feedback Form - Working Test',
    year: '2024-25',
    section: 'A',
    department: 'Electronics & Communication Engineering',
    subjects: [
      'Digital Signal Processing',
      'Microprocessors', 
      'Control Systems',
      'Communication Systems',
      'VLSI Design'
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

createWorkingForm();