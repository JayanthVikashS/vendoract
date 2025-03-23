import { useState } from 'react';
import axios from 'axios';

export default function ProductResearchAgent() {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [deployment, setDeployment] = useState('');
  const [factors, setFactors] = useState([]);
  const [reportType, setReportType] = useState('individual');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/generate-report', {
        purpose,
        deployment_type: deployment,
        priority_factors: factors,
        report_type: reportType
      });
      setReport(res.data.report);
      setStep(5);
    } catch (err) {
      setReport('❌ Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        LLM Product Research Agent
      </h1>

      {step === 0 && (
        <div>
          <p className="mb-2 font-medium">What's your main purpose?</p>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => {
              setPurpose(e.target.value);
              setStep(1);
            }}
          >
            <option value="">--Select--</option>
            <option value="cloud">Cloud Platform</option>
            <option value="database">Database</option>
            <option value="CRM">Customer Relationship Management</option>
            <option value="DevOps">DevOps Tooling</option>
          </select>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-2 font-medium">Preferred deployment type?</p>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => {
              setDeployment(e.target.value);
              setStep(2);
            }}
          >
            <option value="">--Select--</option>
            <option value="SaaS">SaaS</option>
            <option value="On-premise">On-premise</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-2 font-medium">Select your priority factors:</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              'stability',
              'scalability',
              'security',
              'cost',
              'public opinion',
              'technical dependency',
              'long term benefits'
            ].map((f) => (
              <label key={f} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={f}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...factors, f]
                      : factors.filter((x) => x !== f);
                    setFactors(updated);
                  }}
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-2 font-medium">What type of report do you need?</p>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="individual">Individual Product Report</option>
            <option value="comparison">Product Comparison Report</option>
          </select>
          <button
            onClick={handleGenerate}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate Report
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Generated Report:</h2>
          {loading ? (
            <p>Generating report...</p>
          ) : (
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
              {report}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
