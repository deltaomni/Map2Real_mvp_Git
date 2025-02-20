using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Map2Real_mvp_2.Models;
using MySql.Data.MySqlClient;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using Mysqlx.Crud;
using Org.BouncyCastle.Utilities;

namespace Map2Real_mvp_2.Controllers.Map2Real
{
    public class GetMySQLQuery : Controller
    {


        private static readonly string? _server = "<**** your-server *****>.mysql.database.azure.com";
        private static readonly string? _database = "your-datavase";
        private static readonly string? _uid = "your-uid";
        private static readonly string? _code = "your-code";
        public static string connectionString = "Server=" + _server + "; Database=" + _database + "; Uid=" + _uid + "; Pwd=" + _code + ";";

        public static string GetEventsLatLng(string device_imei, string? event_date_start, string? event_date_finish)
        {

            string JSONtext = "";
			Console.WriteLine("Step 0");
			// Best practice is to scope the MySqlConnection to a "using" block
			using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                // Connect to the database
                conn.Open();

                long _UTC = 3 * 3600;
                string sqlStr = "SELECT JSON_ARRAYAGG(" +
                    "JSON_OBJECT(" +
                    "'id', id," +
                    "'date', FROM_UNIXTIME(event_date)," +
                    "'date_bsb', FROM_UNIXTIME(event_date - " + _UTC + ")," +
                    "'device_imei' , device_imei," +
                    "'event_date' ,event_date," +
                    "'lat', CAST(lat AS DECIMAL(10, 6))," +
                    "'lng',  CAST(lng AS DECIMAL(10, 6))," +
                    "'altitude', altitude," +
                    "'heading', heading," +
                    "'speed',  CAST(speed AS DECIMAL(10, 3))," +
                    "'gps_state', gps_state," +
                    "'ignition', CAST(ignition AS SIGNED INTEGER)," +
                    "'odometer', odometer," +
                    "'hourmeter', hourmeter," +
                    "'event_type', event_type," +
                    "'type_id', type_id," +
                    "'output1', output1," +
                    "'output2', output2," +
                    "'input1', input1," +
                    "'input2', input2" +
                    ")" +
                    ") AS JSONSTR FROM events " +
					"WHERE device_imei IN(" + device_imei + ") " +
                    "AND event_type != 'GTIGF2'" + // remove in production
					"AND event_type != 'GTMPF'" + // remove in production
                    "AND FROM_UNIXTIME(event_date - '" + _UTC + "') >= '" + event_date_start + "' " +
                    "AND FROM_UNIXTIME(event_date - '" + _UTC + "') <= '" + event_date_finish + "' " +
                    "ORDER BY device_imei, event_date ASC;";

                MySqlCommand selectCommand = new MySqlCommand(sqlStr, conn);
                MySqlDataReader results = selectCommand.ExecuteReader();

                while (results.Read())
                {
                    if (results[0].ToString() == "")
                    {
					    JSONtext = "{}";
					}
                    else
                    {
                        JSONtext = (string)results[0];
						
					}
                }

            }

            string events = JSONtext;

            return events;
        }
        public static string GetEventsLatLngUTF8(string device_imei, string? event_date_start, string? event_date_finish)
        {
            string JSONtext = "";

            // Best practice is to scope the MySqlConnection to a "using" block
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                // Connect to the database
                conn.Open();

                long _UTC = 3 * 3600;
                string sqlStr = "SELECT *, FROM_UNIXTIME(event_date - 3*3600) AS date_bsb "+
                    "FROM map2real.events "+
                    "WHERE device_imei IN(" + device_imei + ") " +
                    "AND event_type != 'GTIGF2'" + // remove in production
                    // "AND event_type != 'GTMPF'" + // remove in production
                    "AND FROM_UNIXTIME(event_date - '" + _UTC + "') >= '" + event_date_start + "' " +
                    "AND FROM_UNIXTIME(event_date - '" + _UTC + "') <= '" + event_date_finish + "' " +
                    "ORDER BY device_imei, event_date ASC;";

                //Console.WriteLine(sqlStr);
                MySqlCommand selectCommand = new MySqlCommand(sqlStr, conn);
                MySqlDataReader results = selectCommand.ExecuteReader();

                //Enumerate over the rows
                JSONtext += "id\tdevice_imei\tevent_date\tlat\tlng\taltitude\theading\tspeed\tgps_state\tignition\todometer\thourmeter\tevent_type\ttype_id\toutput1\toutput2\tinput1\tinput2\tdate_bsb";
                JSONtext += "\r\n";
                while (results.Read())
                {
                    //Console.WriteLine("Column 0: {0} Column 1: {1}", results[0], results[1]);
                    JSONtext += results[0].ToString() + "\t" + results[1].ToString() + "\t";
                    JSONtext += results[2].ToString() + "\t" + results[3].ToString() + "\t";
                    JSONtext += results[4].ToString() + "\t" + results[5].ToString() + "\t";
                    JSONtext += results[6].ToString() + "\t" + results[7].ToString() + "\t";
                    JSONtext += results[8].ToString() + "\t" + results[9].ToString() + "\t";
                    JSONtext += results[10].ToString() + "\t" + results[11].ToString() + "\t";
                    JSONtext += results[12].ToString() + "\t" + results[13].ToString() + "\t";
                    JSONtext += results[14].ToString() + "\t" + results[15].ToString() + "\t";
                    JSONtext += results[16].ToString() + "\t" + results[17].ToString() + "\t";
                    JSONtext += results[18].ToString();
                    JSONtext += "\r\n";

                }
            }

            string events = JSONtext;

            return events;
        }
    }
}
