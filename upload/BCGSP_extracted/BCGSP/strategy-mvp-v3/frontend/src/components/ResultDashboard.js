export default function ResultDashboard({ result }) {
  if (!result) return null;
  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
      <h3>نتیجه</h3>
      <p><b>نمره آمادگی:</b> {result.readiness_score}/100</p>

      <h4>نقاط شکست</h4>
      <ul>
        {result.key_failures.map((x, i) => <li key={i}>{x}</li>)}
      </ul>

      <h4>گلوگاهها</h4>
      <ul>
        {result.growth_bottlenecks.map((x, i) => <li key={i}>{x}</li>)}
      </ul>

      <h4>نقشه راه ۹۰ روزه</h4>
      <ol>
        {result.roadmap.map((x, i) => <li key={i}>{x}</li>)}
      </ol>
    </div>
  );
}
