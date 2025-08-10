const StatsSection = () => {
  const stats = [
    { number: "1000+", label: "Pièces en stock" },
    { number: "5000+", label: "Clients satisfaits" },
    { number: "24h", label: "Délai de livraison" },
    { number: "15ans", label: "D'expérience" }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;