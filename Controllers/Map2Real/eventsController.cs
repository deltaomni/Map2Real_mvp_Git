using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using Map2Real_mvp_2.Models.Map2Real;


namespace Map2Real_mvp_2.Controllers.Map2Real
{
    [Route("api/[controller]")]
    [ApiController]
    public class eventsController : ControllerBase
    {
        private readonly M2rmysqlContext _context;

        public eventsController(M2rmysqlContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<events>>> Getevents()
        {
            return await _context.events.ToListAsync();
        }

        // GET: api/events/ms
        //[HttpGet("ms/{device_imei}")]
        [HttpGet("ms")]
        [Route("ms/{device_imei?}/{event_date_start?}/{event_date_finish?}/{utf8?}")]
        public string Getmsevents(string? device_imei, string? event_date_start, string? event_date_finish, string? utf8)
        {
            if (device_imei == null || device_imei == "")
            {
                //device_imei = "122145";
                device_imei = "867488060855003";
            }

            DateTime TripNow = DateTime.Now;
            string events = "";
            string tripYr = TripNow.Year.ToString();
            string tripMonth = TripNow.Month.ToString();
            string tripDayStart = (TripNow.Day - 1).ToString();
            string tripDayFinish = (TripNow.Day + 1).ToString();
            if (event_date_start == null || event_date_start == "")
            {
                event_date_start = tripYr + "-" + tripMonth + "-" + tripDayStart;
            }

            if (event_date_finish == null || event_date_finish == "")
            {
                event_date_finish = tripYr + "-" + tripMonth + "-" + tripDayFinish;
            }


            if (utf8 != "utf8")
            {
                events = GetMySQLQuery.GetEventsLatLng(device_imei, event_date_start, event_date_finish);
            }
            else
            {
                events = GetMySQLQuery.GetEventsLatLngUTF8(device_imei, event_date_start, event_date_finish);
            }
            return events;
        }

        // GET: api/events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<events>> Getevents(long id)
        {
            var events = await _context.events.FindAsync(id);

            if (events == null)
            {
                return NotFound();
            }

            return events;
        }


        // PUT: api/events/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Putevents(long id, events events)
        {
            if (id != events.id)
            {
                return BadRequest();
            }

            _context.Entry(events).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!eventsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/events
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<events>> Postevents(events events)
        {
            _context.events.Add(events);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getevents", new { events.id }, events);
        }

        // DELETE: api/events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deleteevents(long id)
        {
            var events = await _context.events.FindAsync(id);
            if (events == null)
            {
                return NotFound();
            }

            _context.events.Remove(events);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool eventsExists(long id)
        {
            return _context.events.Any(e => e.id == id);
        }
    }
}
