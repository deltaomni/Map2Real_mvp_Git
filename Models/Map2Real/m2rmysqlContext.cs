using Microsoft.EntityFrameworkCore;

namespace Map2Real_mvp_2.Models.Map2Real
{
    public class M2rmysqlContext : DbContext
    {
        public M2rmysqlContext(DbContextOptions<M2rmysqlContext> options)
            : base(options)
        {
        }

        public DbSet<events> events { get; set; } = null!;

		public DbSet<Trips> Trips { get; set; } = null!;
	}
}
