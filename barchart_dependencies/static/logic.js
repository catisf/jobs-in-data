// Define a global variable to store cleaned data
let cleanedData;

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the /print_sample_data_uk route for United Kingdom
    fetch('/print_sample_data_uk')
        .then(response => response.json())
        .then(data => {
            cleanedData = JSON.parse(data.cleaned_data_uk);

            // Get unique years from the data
            const uniqueYears = [...new Set(cleanedData.map(entry => entry.work_year))];
            uniqueYears.sort((a, b) => b - a);

            // Populate the year dropdown
            const yearSelection = document.getElementById('yearSelection');
            populateDropdown(yearSelection, uniqueYears);

            // Set up initial chart with the first year and default data type (job title)
            updateChart(cleanedData, uniqueYears[0], 'jobTitle');

            // Update chart when the year selection changes
            yearSelection.addEventListener('change', () => {
                const selectedYear = parseInt(yearSelection.value);
                // Pass the current selected data type (job title or experience level)
                const dataType = document.getElementById('jobTitleBtn').classList.contains('active') ? 'jobTitle' : 'experienceLevel'; 
                updateChart(cleanedData, selectedYear, dataType);
            });

            // Set up event listeners for the data type buttons
            document.getElementById('jobTitleBtn').addEventListener('click', () => switchData('jobTitle'));
            document.getElementById('experienceLevelBtn').addEventListener('click', () => switchData('experienceLevel'));
        });
});

// Function to populate a dropdown with options
function populateDropdown(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Function to switch between job title and experience level
function switchData(dataType) {
    // Remove 'active' class from all buttons
    document.getElementById('jobTitleBtn').classList.remove('active');
    document.getElementById('experienceLevelBtn').classList.remove('active');

    // Add 'active' class to the clicked button
    document.getElementById(`${dataType}Btn`).classList.add('active');

    // Get the selected year
    const selectedYear = parseInt(document.getElementById('yearSelection').value);

    // Update the chart with the selected year and data type
    updateChart(cleanedData, selectedYear, dataType);
}

// Function to update the chart based on the selected year and data type
function updateChart(cleanedData, selectedYear, dataType) {
    const filteredData = cleanedData.filter(entry => entry.work_year === selectedYear);

    let groupedData;
    if (dataType === 'jobTitle') {
        groupedData = groupDataByJobTitle(filteredData);
    } else if (dataType === 'experienceLevel') {
        groupedData = groupDataByExperienceLevel(filteredData);
    }

    const averageSalaries = calculateAverageSalaries(groupedData);
    const sortedSalaries = sortSalariesByAverage(averageSalaries);

    const labels = sortedSalaries.map(entry => entry.label);
    const averageSalariesData = sortedSalaries.map(entry => entry.averageSalary);

    const ctx = document.getElementById('worldDataChart').getContext('2d');
    destroyExistingChart();
    createNewChart(ctx, labels, averageSalariesData, dataType);
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

// Function to calculate average salary for each job title or experience level
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
    const xAxisTitle = dataType === 'jobTitle' ? 'Job Title' : 'Experience Level';

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
