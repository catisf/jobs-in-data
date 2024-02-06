from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask application
app = Flask(__name__)

# Create SQLite database engine
engine = create_engine('sqlite:///data_analyst_jobs.db')

# Define file path using environment variables or relative path
cleaned_data_path = os.getenv('CLEANED_DATA_PATH', 'cleaned_data.csv')

# Load cleaned data from CSV file
cleaned_data = pd.read_csv(cleaned_data_path)

# Save cleaned data to the database
cleaned_data.to_sql('cleaned_data', engine, index=False, if_exists='replace')

# Define a route to print sample data from the cleaned data for United Kingdom
@app.route('/print_sample_data_uk')
def print_sample_data_uk():
    try:
        # Retrieve sample data for United Kingdom from the cleaned_data table
        cleaned_data_uk = pd.read_sql('SELECT * FROM cleaned_data WHERE company_location = "United Kingdom"', engine)

        # Convert data to JSON format
        cleaned_data_json = cleaned_data_uk.to_json(orient='records')

        # Return a JSON response
        return jsonify({'cleaned_data_uk': cleaned_data_json})
    except Exception as e:
        # Print the exception for debugging
        print(f"Error in print_sample_data_uk route: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Define the main route to render the index.html template
@app.route('/')
def index():
    return render_template('index.html')

# Run the application
if __name__ == '__main__':
    # Enable debugging and reloading in the development environment
    debug = os.getenv('DEBUG', True)
    use_reloader = os.getenv('USE_RELOADER', True)

    app.run(debug=debug, use_reloader=use_reloader)
