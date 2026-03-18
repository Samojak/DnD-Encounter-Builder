using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Monster> Monsters => Set<Monster>();
    public DbSet<Encounter> Encounters => Set<Encounter>();
    public DbSet<EncounterMonster> EncounterMonsters => Set<EncounterMonster>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Monster>()
            .HasIndex(m => m.ApiIndex)
            .IsUnique();

        modelBuilder.Entity<EncounterMonster>()
            .HasOne(em => em.Encounter)
            .WithMany(e => e.EncounterMonsters)
            .HasForeignKey(em => em.EncounterId);

        modelBuilder.Entity<EncounterMonster>()
            .HasOne(em => em.Monster)
            .WithMany(m => m.EncounterMonsters)
            .HasForeignKey(em => em.MonsterId);
    }
}