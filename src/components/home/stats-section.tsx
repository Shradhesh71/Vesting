export function StatsSection() {
  const stats = [
    { value: '$50M+', label: 'Total Value Locked' },
    { value: '1,000+', label: 'Active Vesting Contracts' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '24/7', label: 'Security Monitoring' },
  ]

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
