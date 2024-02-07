// Define a global variable to store cleaned data
let cleanedData;

anychart.onDocumentReady(function () {

    // load the data
    anychart.data.loadJsonFile("https://static.anychart.com/git-storage/word-press/data/choropleth-map-tutorial/data.json", function (data) {

      // Variables
      // go into the records section of the data
      var geoData = data.records

      // sum of all cases per country
      var sumCases = 0;

      // convert cases to numbers
      var numC;

      // create a new array with the resulting data
      var data = [];

      // Go through the initial data
      for (var i = 0; i < geoData.length; i++) {
        // convert strings to numbers and save them to new variables
        numC = parseInt(geoData[i].cases);

        // check if we are in the same country by comparing the geoId. 
        // if the country is the same add the cases to the appropriate variables
        if ((geoData[i + 1]) != null && (geoData[i].geoId == geoData[i + 1].geoId)) {
          sumCases = sumCases + numC;
        }
        else {

          // add last day cases of the same country
          sumCases = sumCases + numC;

          // insert the resulting data in the array using the AnyChart keywords 
          data.push({ id: geoData[i].geoId, value: sumCases, title: geoData[i].countriesAndTerritories })

          // reset the variables to start over
          sumCases = 0;

        }
      };

      // connect the data with the map
      var chart = anychart.map(data);
      chart.geoData(anychart.maps.world);

      // specify the chart type and set the series 
      var series = chart.choropleth(data);

      // color scale ranges
      ocs = anychart.scales.ordinalColor([
        { less: 99 },
        { from: 100, to: 999 },
        { from: 1000, to: 9999 },
        { from: 10000, to: 29999 },
        { from: 30000, to: 39000 },
        { from: 40000, to: 59000 },
        { from: 60000, to: 99999 },
        { greater: 100000 }
      ]);

      // set scale colors
      ocs.colors(["rgb(252,245,245)", "rgb(241,219,216)", "rgb(229,190,185)", "rgb(211,152,145)", "rgb(192,117,109)", "rgb(178,93,86)", "rgb(152,50,48)", "rgb(150,33,31)"]);

      // tell the series what to use as a colorRange (colorScale)
      series.colorScale(ocs);

      // set the container id
      chart.container('mapContainer');     

      // draw the chart
      chart.draw();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the /print_sample_data_uk route for the United Kingdom
    fetch('/print_sample_data_uk')
        .then(response => response.json())
        .then(data => {
            cleanedData = JSON.parse(data.cleaned_data_uk);

            // Get unique years from the data
            const uniqueYears = [...new Set(cleanedData.map(entry => entry.work_year))];
            uniqueYears.sort((a, b) => b - a);

            // Add "All Years" option to the year dropdown
            uniqueYears.unshift('All Years');

            // Populate the year dropdown
            const yearSelection = document.getElementById('yearSelection');
            if (yearSelection) {
                populateDropdown(yearSelection, uniqueYears);

                // Set up initial chart with the first year and default data type (job category)
                updateChart(cleanedData, uniqueYears[0], 'jobCategory', null);

                // Update chart when the year or category selection changes
                yearSelection.addEventListener('change', () => {
                    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);
                    const selectedCategory = getCategorySelection();
                    const dataType = getDataType();
                    updateChart(cleanedData, selectedYear, dataType, selectedCategory);
                });
            }

            // Populate the job category dropdown
            const categorySelection = document.getElementById('categorySelection');
            if (categorySelection) {
                const uniqueCategories = [...new Set(cleanedData.map(entry => entry.job_category))];
                populateDropdown(categorySelection, uniqueCategories);

                // Set up initial chart with the default year and job category
                const defaultYear = uniqueYears[0];
                const defaultCategory = getCategorySelection();
                const defaultDataType = getDataType();
                updateChart(cleanedData, defaultYear, defaultDataType, defaultCategory);

                // Update chart when the category selection changes
                categorySelection.addEventListener('change', () => {
                    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);
                    const selectedCategory = getCategorySelection();
                    const dataType = getDataType();
                    updateChart(cleanedData, selectedYear, dataType, selectedCategory);
                });
            }

            // Set up event listeners for the data type buttons
            document.getElementById('jobCategoryBtn').addEventListener('click', () => switchData('jobCategory'));
            document.getElementById('experienceLevelBtn').addEventListener('click', () => switchData('experienceLevel'));
            document.getElementById('jobTitleBtn').addEventListener('click', () => switchData('jobTitle'));
        });

    // After initializing the chart and dropdowns, add the 'show' class to elements
    document.querySelector('header').classList.add('show');
    document.querySelector('canvas').classList.add('show');
    document.querySelector('.year-dropdown-container').classList.add('show');
    document.querySelector('.switch-buttons').classList.add('show');
    document.querySelector('footer').classList.add('show');
});
// Function to get the selected category
function getCategorySelection() {
    const categorySelection = document.getElementById('categorySelection');
    return categorySelection ? categorySelection.value : null;
}

// Function to get the selected data type
function getDataType() {
    if (document.getElementById('jobCategoryBtn').classList.contains('active')) {
        return 'jobCategory';
    } else if (document.getElementById('experienceLevelBtn').classList.contains('active')) {
        return 'experienceLevel';
    } else if (document.getElementById('jobTitleBtn').classList.contains('active')) {
        return 'jobTitle';
    }
}

// Function to populate a dropdown with options
function populateDropdown(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Function to switch between job category, experience level, and job title
function switchData(dataType) {
    // Remove 'active' class from all buttons
    document.getElementById('jobCategoryBtn').classList.remove('active');
    document.getElementById('experienceLevelBtn').classList.remove('active');
    document.getElementById('jobTitleBtn').classList.remove('active');

    // Add 'active' class to the clicked button
    document.getElementById(`${dataType}Btn`).classList.add('active');

    // Get the selected year
    const selectedYear = yearSelection.value === 'All Years' ? null : parseInt(yearSelection.value);

    // Update the chart with the selected year and data type
    updateChart(cleanedData, selectedYear, dataType);
}

// Function to update the chart based on the selected year, data type, and category
function updateChart(cleanedData, selectedYear, dataType, selectedCategory) {
    let filteredData;

    if (selectedYear !== null) {
        filteredData = cleanedData.filter(entry => entry.work_year === selectedYear);
    } else {
        filteredData = cleanedData;
    }

    if (selectedCategory) {
        filteredData = filteredData.filter(entry => entry.job_category === selectedCategory);
    }

    let groupedData;

    if (dataType === 'jobCategory') {
        groupedData = groupDataByJobCategory(filteredData);
    } else if (dataType === 'experienceLevel') {
        groupedData = groupDataByExperienceLevel(filteredData);
    } else if (dataType === 'jobTitle') {
        groupedData = groupDataByJobTitle(filteredData);
    }

    const averageSalaries = calculateAverageSalaries(groupedData);
    const sortedSalaries = sortSalariesByAverage(averageSalaries);

    const labels = sortedSalaries.map(entry => entry.label);
    const averageSalariesData = sortedSalaries.map(entry => entry.averageSalary);

    const ctx = document.getElementById('DataJobChart').getContext('2d');
    destroyExistingChart();
    createNewChart(ctx, labels, averageSalariesData, dataType);
}

// Function to group data by job category
function groupDataByJobCategory(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.job_category;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to group data by experience level
function groupDataByExperienceLevel(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.experience_level;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to group data by job title
function groupDataByJobTitle(filteredData) {
    return filteredData.reduce((acc, entry) => {
        const label = entry.job_title;
        if (!acc[label]) {
            acc[label] = {
                totalSalary: entry.salary_in_gbp,
                count: 1
            };
        } else {
            acc[label].totalSalary += entry.salary_in_gbp;
            acc[label].count += 1;
        }
        return acc;
    }, {});
}

// Function to calculate average salary for each job category, experience level, or job title
function calculateAverageSalaries(groupedData) {
    return Object.keys(groupedData).map(label => ({
        label,
        averageSalary: groupedData[label].totalSalary / groupedData[label].count
    }));
}

// Function to sort salaries by average salary
function sortSalariesByAverage(averageSalaries) {
    return averageSalaries.sort((a, b) => b.averageSalary - a.averageSalary);
}

// Function to destroy an existing chart
function destroyExistingChart() {
    if (window.myChart) {
        window.myChart.destroy();
    }
}

// Function to create a new chart
function createNewChart(ctx, labels, averageSalariesData, dataType) {
    const xAxisTitle = getChartXAxisTitle(dataType);

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Salary (GBP)',
                data: averageSalariesData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: true,
                        borderWidth: 0,
                        color: 'rgba(0,0,0,0)'
                    },
                    type: 'category',
                    title: {
                        display: true,
                        text: xAxisTitle,
                        font: {
                            weight: 'bold'
                        }
                    },
                    labels: labels,
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Salary (GBP)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Function to get the chart X-axis title based on the data type
function getChartXAxisTitle(dataType) {
    switch (dataType) {
        case 'jobCategory':
            return 'Job Category';
        case 'experienceLevel':
            return 'Experience Level';
        case 'jobTitle':
            return 'Job Title';
        default:
            return '';
    }
}
