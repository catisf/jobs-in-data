# So you want to be a data analyst?
## Job and salary trends in data-related careers (2020-2023)

<p align="center">
  <img src = "https://github.com/catisf/jobs-in-data/blob/main/images/dashboard.png" height = "75%" width = "75%">
</p>
<h6 align="center">Fig. 1 - Interactive dashboard</h6>


## Contents:
1. [Overview](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#1-overview)
2. [Project development stages](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#2-project-development-stages)
3. [Set up and execution](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#3-set-up-and-execution)
4. [Ethical considerations](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#4-ethical-considerations)
5. [Data source](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#5-data-source)
6. [Code source](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#6-code-source)
7. [Authors](https://github.com/catisf/jobs-in-data/blob/catisf/map/README.md#7-authors)

## 1. Overview
> "Employer demand for specialist data skills is growing across a wide range of industries"

This quote from a [UK Parliament post from 2023](https://researchbriefings.files.parliament.uk/documents/POST-PN-0697/POST-PN-0697.pdf), showcases why data-related jobs have been on the rise in recent years. As we approach the end of this data analytics bootcamp, and will be ourselves looking to get into this industry, we delved on this project as a way to get useful insights of trends in the data job market. 

We created an interactive web application that visualizes global job market trends based on a dataset of data-related job postings. The application will utilize data on job titles, categories, salaries, and company locations to provide insightful visualizations for users. The project will employ web technologies such as Python Flask for the backend, HTML/CSS for the frontend, and JavaScript for interactive data visualization.

## 2. Project development stages
- We used the kaggle API to fetch the data from an existing [dataset](https://www.kaggle.com/datasets/hummaamqaasim/jobs-in-data)
- Using jupyter notebook, we then cleaned the data and rearranged the columns
- Created an Entitity Relationship Diagram (ERD) and stored the data in a PostgreSQL database
- We also used SQLite to create a database to serve an API
- Using flask we set up two API routes to serve the data
- Using a combination of html, css and javascript we created an interactive dashboard with job market trends. Colour palletes were chosen to be colourblind-friendly.

<p align="center">
  <img src = "https://github.com/catisf/jobs-in-data/blob/main/images/app_flowchart.png" height = "75%" width = "75%">
</p>
<h6 align="center">Fig. 2 - Project development stages</h6>

## 3. Set up and execution
1. Clone the repository to your local computer. In your Terminal, type `git clone https://github.com/catisf/jobs-in-data.git`
2. In the Terminal, navigate to the relevant folder and type `python app.py`

## 4. Ethical considerations
We used a publicly available dataset. The dataset contains no personal information or information that could cause any harm to individuals. The source has been dully credited. Our visualisations are original. The code used for the project is publicly available on this repository, promoting transparency in our data handling. 

## 5. Data source
Data was sourced from the following dataset on kaggle: https://www.kaggle.com/datasets/hummaamqaasim/jobs-in-data

## 6. Code source
Parts of our code were adapted from the documentation of the libraries used, such as:
- [AnyChart documentation](https://docs.anychart.com/Maps/Choropleth_Map)

## 7. Authors
The following authors worked collaboratively on this project:
- [Catarina Ferreira](https://github.com/catisf)
- [Elcin Kobya Imanci](https://github.com/ELCINKOBYAIMANCI)
- [Godswill Anyasor](https://github.com/AnyasorG)
- [Yuk Hang Hui](https://github.com/alexyhHui)




