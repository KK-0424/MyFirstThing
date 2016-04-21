namespace WebIm.Modules
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class MySqlDb : DbContext
    {
        public MySqlDb()
            : base("name=MySqlDb")
        {
            this.Database.Initialize(false);        
        }

        public virtual DbSet<login> logins { get; set; }
        public virtual DbSet<register> registers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<login>()
                .Property(e => e.userId)
                .IsUnicode(false);

            modelBuilder.Entity<login>()
                .Property(e => e.userName)
                .IsUnicode(false);

            modelBuilder.Entity<login>()
                .Property(e => e.password)
                .IsUnicode(false);

            modelBuilder.Entity<register>()
                .Property(e => e.userId)
                .IsUnicode(false);

            modelBuilder.Entity<register>()
                .Property(e => e.nickName)
                .IsUnicode(false);

            modelBuilder.Entity<register>()
                .Property(e => e.email)
                .IsUnicode(false);

            modelBuilder.Entity<register>()
                .Property(e => e.password)
                .IsUnicode(false);

            modelBuilder.Entity<register>()
                .Property(e => e.userName)
                .IsUnicode(false);
        }
    }
}
