using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Signing;
using System;
using System.Collections;
using System.IO;
using Map2Real_mvp_2.Models;
using Map2Real_mvp_2.Models.Map2Real;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Map2Real_mvp_2.Controllers.Map2Real
{
	[Route("api/[controller]")]
	[ApiController]
	public class TripReportController : ControllerBase
	{

		// GET: api/TripReport/file
		[HttpGet("{file}")]
		public string? Get(string? file)
		{
			System.Console.WriteLine(file);
			return file;
		}

		// POST: api/TripReport
		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPost]
		public async Task<string> PostTrips(Trips Trips)
		{
			//System.Console.WriteLine(Trips.TripRows);
			string saved = await Main(Trips.TripRows, Trips.Device_Imei, Trips.Date_Start, Trips.Date_Finish);
			return saved;
		}


		static async Task<string> Main(string? TripRows, string? Device_Imei, string? Date_Start, string? Date_Finish) {

			string?[] TripArray = TripRows.Split(";");
			//string dd = DateTime.Now.ToString().Replace("/", "");
			string dd = Date_Start + "_" + Date_Finish;

            dd = dd.Replace(" ", "_");
			dd = dd.Replace(":", "");
			string? di = Device_Imei?.Substring(Device_Imei.Length - 4);
			string fileName = "Rel_" + di + "_" + dd + ".txt";

			var docPath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\downloads", fileName);

			// Write the string array to a new file named "WriteLines.txt".
			await using (StreamWriter outputFile = new StreamWriter(docPath, false, Encoding.UTF8, 512))
			{
				foreach (var row in TripArray)
				outputFile.WriteLine(row.ToString());
			}

			return  fileName;
		}
	}

}
