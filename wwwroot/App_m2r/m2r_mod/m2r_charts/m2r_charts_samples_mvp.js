/**
 * Copyright (c) 2024
 * MapOmega Tecnologia
 * 
 * MAP2REAL MVP REV2024.01
 * This file set dfinitions for chart samples
 * for MAP2REAL MVP REV2024.01
 *
 * @summary chart samples at driver's summary report
 * @author KingOfDendroar <support@mapomega.com>
 * @location [RDF, SAS, C]
 *
 * Created on       : 2024-05-14 00:00:00 
 * Revision         : 01/   2024-05-14  
 * Last modified    : 2024-05-14 11:00:00
 * 
 */

document.addEventListener("DOMContentLoaded", function () {
	// Pyradid chart
	new Chart(document.getElementById("chartjs_perfil"), {
		type: 'bar',
		data: {
			labels: ["Viagens Curtas L", "Viagens Curtas R", "Viagens Médias L", "Viagens Médias R", "Viagens Longas"],
			datasets: [{
				axis: 'y',
				label: 'Perfil',
				data: [55, 28, 4, 11, 2],
				fill: false,

				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)'
				],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			legend: {
				display: false,
				label: {
					maxWidth: 30,
					boxHeigth: 20,
					color: 'blue',
					padding: 10
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					grid: {
						display: false
					}
				}
			}
		}
	});
});

document.addEventListener("DOMContentLoaded", function () {
	// Pyradid chart
	new Chart(document.getElementById("chartjs_perfil_2"), {
		type: 'bar',
		data: {
			labels: ["Viagens Curtas L", "Viagens Curtas R", "Viagens Médias L", "Viagens Médias R", "Viagens Longas"],
			datasets: [{
				axis: 'y',
				label: 'Perfil',
				data: [11, 13, 14, 42, 20],
				fill: false,

				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)'
				],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			legend: {
				display: false,
				label: {
					maxWidth: 30,
					boxHeigth: 20,
					color: 'blue',
					padding: 10
				}
			},
			scales: {
				x: {
					grid: {
						display: false
					}
				},
				y: {
					grid: {
						display: false
					}
				}
			}
		}
	});
});


document.addEventListener("DOMContentLoaded", function () {
	// Doughnut chart
	new Chart(document.getElementById("chartjs-periodo"), {
			type: 'doughnut',
			data: {
				datasets: [
					{
						data: [65, 25, 10],
						backgroundColor: [
							'#e2e38b',
							'#292965',
							'#6696ba'
						],
					},
				],
				labels: ['Diurno', 'Noturno', 'Madrugada'],
			},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				datalabels: {
					formatter: (value) => {
						return value + '%';
					},
				},
			},
		}
		
	});
});

document.addEventListener("DOMContentLoaded", function () {
	// Doughnut chart
	new Chart(document.getElementById("chartjs-periodo_2"), {
		type: 'doughnut',
		data: {
			datasets: [
				{
					data: [82, 18, 0],
					backgroundColor: [
						'#e2e38b',
						'#292965',
						'#6696ba'
					],
				},
			],
			labels: ['Diurno', 'Noturno', 'Madrugada'],
		},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				datalabels: {
					formatter: (value) => {
						return value + '%';
					},
				},
			},
		}

	});
});

document.addEventListener("DOMContentLoaded", function () {
	// Doughnut chart
	new Chart(document.getElementById("chartjs-vmax"), {
		type: 'doughnut',
		data: {
			datasets: [
				{
					data: [57, 43],
					backgroundColor: [
						'green',
						'orange'
					],
				},
			],
			labels: ['Disciplina', 'Indisciplina'],
		},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				datalabels: {
					formatter: (value) => {
						return value + '%';
					},
				},
			},
		}

	});
});

document.addEventListener("DOMContentLoaded", function () {
	// Doughnut chart
	new Chart(document.getElementById("chartjs-vmax_2"), {
		type: 'doughnut',
		data: {
			datasets: [
				{
					data: [78, 22],
					backgroundColor: [
						'green',
						'orange'
					],
				},
			],
			labels: ['Disciplina', 'Indisciplina'],
		},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			plugins: {
				datalabels: {
					formatter: (value) => {
						return value + '%';
					},
				},
			},
		}

	});
});

document.addEventListener("DOMContentLoaded", function () {
	
	new Chart(document.getElementById("chartjs_vinstantanea"), {
		type: 'bar',
		options: {
			indexAxis: 'y',
			plugins: {
				tooltip: {
					callbacks: {
						label: (c) => {
							const value = Number(c.raw);
							const positiveOnly = value < 0 ? -value : value;
							return `${c.dataset.label}: ${positiveOnly.toString()}`;
						},
					},
				},
			},
			scales: {

				x: {
					min: -30,
					max: 30,
					ticks: {
						stepSize: 5,
						callback: (v) => v < 0 ? -v : v,
					},

				},
				x: {
					grid: {
						display: false
					}
				},
				y: {
					grid: {
						display: false
					}
				}
			},
		},
		data: {
			//labels: ["71+", "61-70", "51-60", "41-50", "31-40", "21-30", "0-20"],
			//labels: ["Vi: 0", "0<Vi<31", "30<Vi<61", "60<Vi<91", "90<Vi<121", "120<Vi"],
			labels: ["120<Vi", "90<Vi<121", "60<Vi<91", "30<Vi<61", "0<Vi<31", "Vi: 0"],
			datasets: [
				{
					label: "Início Turno",
					stack: "Stack 0",
					backgroundColor: "pink",
					data: [0,7,10,15,9,8].map((k) => -k),
				},
				{
					label: "Fim de Turno",
					stack: "Stack 0",
					backgroundColor: "pink",
					data: [0,7,10,15,9,8],
				},
			],
		}

	});
});

document.addEventListener("DOMContentLoaded", function () {

	new Chart(document.getElementById("chartjs_vinstantanea_2"), {
		type: 'bar',
		options: {
			indexAxis: 'y',
			plugins: {
				tooltip: {
					callbacks: {
						label: (c) => {
							const value = Number(c.raw);
							const positiveOnly = value < 0 ? -value : value;
							return `${c.dataset.label}: ${positiveOnly.toString()}`;
						},
					},
				},
			},
			scales: {

				x: {
					min: -30,
					max: 30,
					ticks: {
						stepSize: 5,
						callback: (v) => v < 0 ? -v : v,
					},

				},
				x: {
					grid: {
						display: false
					}
				},
				y: {
					grid: {
						display: false
					}
				}
			},
		},
		data: {
			labels: ["120<Vi", "90<Vi<121", "60<Vi<91", "30<Vi<61", "0<Vi<31", "Vi: 0"],
			datasets: [
				{
					label: "Início Turno",
					stack: "Stack 0",
					backgroundColor: "lightblue",
					data: [2, 12, 19, 10, 5, 3].map((k) => -k),
				},
				{
					label: "Fim de Turno",
					stack: "Stack 0",
					backgroundColor: "lightblue",
					data: [2, 12, 19, 10, 5, 3],
				},
			],
		}

	});
});