using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Runtime.InteropServices;

namespace Map2Real_mvp_2.Models.Map2Real
{
    public class events
    {
        public long id { get; set; }
        public string? device_imei { get; set; }
        public string? event_date { get; set; }
        public string? lat { get; set; }
        public string? lng { get; set; }
        public string? altitude { get; set; }
        public string? heading { get; set; }
        public string? speed { get; set; }
        public string? gps_state { get; set; }
        public string? ignition { get; set; }
        public string? odometer { get; set; }
        public string? hourmeter { get; set; }
        public string? event_type { get; set; }
        public string? type_id { get; set; }
        public bool output1 { get; set; }
        public bool output2 { get; set; }
        public bool input1 { get; set; }
        public bool input2 { get; set; }
    }

    public class Trips
    {
        public string? TripRows { get; set; }
		public string? Device_Imei { get; set; }
        public string? Date_Start { get; set; }
        public string? Date_Finish { get; set; }
    }

}
