//task1

const companies = [
    { name: 'Intelliswift', hq: 'Newark, CA', indiaLocations: ['Pune', 'Bengaluru'] },
    { name: 'Salesforce', hq: 'San Francisco, CA', indiaLocations: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Gurugram', 'Jaipur'] }
  ];
  
  // Task-1
  console.log('Number of companies:', companies.length);
  
  console.log('Name of companies:');
  companies.forEach(company => {
    console.log(company.name);
  });
  
  console.log('Headquarters of the companies:');
  companies.forEach(company => {
    console.log(`${company.name} - ${company.hq}`);
  });
  