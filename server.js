import express from 'express';
import { createConnection } from 'mysql2';
import excel from 'exceljs';

const app = express();

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'go_sample'
};

// Create a MySQL database connection
const connection = createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/', (req, res) => {
    console.log('Received a GET HTTP method request at /');
    const query = 'SELECT * FROM cel';
  
    // Execute the query
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing the query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Create an Excel workbook and worksheet
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Cel');
  
      // Add headers to the Excel file
      const headers = Object.keys(results[0]); // Get the column names from the first result
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));
  
      // Add data rows to the Excel file
      results.forEach((result) => {
        worksheet.addRow(result);
      });
  
      // Generate a unique file name
    //   const timestamp = new Date().toISOString().replace(/[-:]/g, '');
    //   const fileName = `CelData_${timestamp}.xlsx`;
  
      // Stream the Excel file to the response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="javascript_excel.xlsx"`);
      workbook.xlsx.write(res)
        .then(() => {
          res.end();
        });
    });
  });
  

app.listen(4000, () => {
    console.log('Example app listening on port 4000!');
});
