using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Map2Real_mvp_2.Data.Map2Real
{
    public class m2r_ApplicationDbContext : IdentityDbContext
    {
        public m2r_ApplicationDbContext(DbContextOptions<m2r_ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
