import ReactMarkdown from 'react-markdown';
import Autocomplete from '@mui/material/Autocomplete';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react';
import {
  Container, Typography, FormControl, InputLabel, Select, MenuItem,
  Checkbox, ListItemText, OutlinedInput, Button, CircularProgress,
  TextField, Box, Card, CardContent, Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const questions = [
  {
    label: 'Which domain are you interested in?',
    field: 'purpose',
    options: ['Cloud Platform', 'Database', 'CRM', 'DevOps', 'Security Tools', 'AI Tools']
  },
  {
    label: 'What type of deployment do you prefer?',
    field: 'deployment',
    options: ['SaaS', 'On-premise', 'Hybrid']
  },
  {
    label: 'What are your top priority factors?',
    field: 'factors',
    options: ['Stability', 'Scalability', 'Security', 'Cost', 'Public Opinion', 'Technical Dependency', 'Long Term Benefits'],
    multiple: true
  },
  {
    label: 'What industry are you in?',
    field: 'industry',
    options: ['Finance', 'Healthcare', 'Retail', 'Education', 'Tech Startup', 'Other']
  },
  {
    label: 'What size is your organization?',
    field: 'organization_size',
    options: ['Startup (1-10)', 'Small (11-100)', 'Mid-size (101-500)', 'Large (500+)']
  },
  {
    label: 'What technical tools or integrations do you require?',
    field: 'tech_dependencies',
    chipInput: true
  },
  {
    label: 'What kind of budget model do you prefer?',
    field: 'budget_model',
    options: ['Project-Based (Fixed)', 'Usage-Based (Pay-as-you-go)', 'Enterprise Licensing']
  },
  {
    label: 'How important is system reliability for your use case?',
    field: 'reliability_needs',
    options: ['Low (Non-critical)', 'Medium (Important)', 'High (Mission-Critical)']
  },
  {
    label: 'What level of disaster tolerance do you expect?',
    field: 'disaster_tolerance',
    options: ['Minimal Backup', 'Automated Failover', 'Geo-Redundant Failover']
  },
  {
    label: 'Any other specific technical requirements?',
    field: 'drilldown',
    textInput: true
  }
];

export default function ProductResearchAgent() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [reportType, setReportType] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [techOptions, setTechOptions] = useState([]);

  const current = questions[step];

  const handleNext = async () => {
    const value = answers[current.field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      alert('Please provide a value before continuing.');
      return;
    }

    // Fetch Gemini tool suggestions after purpose is selected
    if (current.field === 'purpose') {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggest-tech-options`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purpose: value })
        });
        const data = await res.json();
        setTechOptions(data.tools || []);
      } catch (error) {
        console.error('Failed to fetch technical tool suggestions:', error);
      }
    }

    setStep(step + 1);
  };

  const handleChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggest-products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    const data = await res.json();
    setSuggestedProducts(Array.isArray(data.products) ? data.products : []);
    setLoading(false);
    setStep(step + 1);
  };

  const generateReport = async () => {
    if (!reportType || selectedProducts.length === 0) return alert("Select report type and at least one product.");
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...answers,
        selected_products: selectedProducts,
        report_type: reportType
      })
    });
    const data = await res.json();
    setReport(data.report);
    setLoading(false);
    setStep(step + 1);
  };

    return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Vendoract
      </Typography>

      {step < questions.length && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{current.label}</Typography>

            {current.textInput ? (
              <TextField
                fullWidth
                placeholder="e.g., CI/CD tools, Kubernetes support"
                value={answers[current.field] || ''}
                onChange={(e) => handleChange(current.field, e.target.value)}
              />
            ) : current.chipInput ? (
              <Autocomplete
                multiple
                freeSolo
                options={techOptions}
                value={answers[current.field] || []}
                onChange={(e, value) => handleChange(current.field, value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select or enter tools"
                    placeholder="e.g., Docker, Kubernetes, Jenkins"
                  />
                )}
              />
            ) : current.multiple ? (
              <FormControl fullWidth>
                <InputLabel>{current.label}</InputLabel>
                <Select
                  multiple
                  value={answers[current.field] || []}
                  onChange={(e) => handleChange(current.field, e.target.value)}
                  input={<OutlinedInput label={current.label} />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {current.options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      <Checkbox checked={(answers[current.field] || []).includes(opt)} />
                      <ListItemText primary={opt} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <InputLabel>{current.label}</InputLabel>
                <Select
                  value={answers[current.field] || ''}
                  onChange={(e) => handleChange(current.field, e.target.value)}
                >
                  {current.options.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box textAlign="right" mt={3}>
              <Button variant="contained" onClick={handleNext}>Next</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {step === questions.length && (
        <Box textAlign="center" mt={3}>
          {loading ? <CircularProgress /> : (
            <Button variant="contained" onClick={fetchSuggestions}>
              Get Product Suggestions
            </Button>
          )}
        </Box>
      )}

      {step === questions.length + 1 && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>Gemini Suggestions</Typography>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Select Products</InputLabel>
            <Select
              multiple
              value={selectedProducts}
              onChange={(e) => setSelectedProducts(e.target.value)}
              input={<OutlinedInput label="Select Products" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {Array.isArray(suggestedProducts) && suggestedProducts.length > 0 ? (
                suggestedProducts.map((product) => (
                  <MenuItem key={product} value={product}>
                    <Checkbox checked={selectedProducts.includes(product)} />
                    <ListItemText primary={product} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No suggestions available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Select Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="individual">Comprehensive Individual Report</MenuItem>
              <MenuItem value="comparison">Technical Comparison Report</MenuItem>
            </Select>
          </FormControl>

          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={generateReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Box>
        </>
      )}

      {step === questions.length + 2 && (
        <>
          <Typography variant="h6" sx={{ my: 2 }}>Generated Report</Typography>
          {loading ? <CircularProgress /> : (
            <>
              <Box
                sx={{
                  background: '#1e1e1e',
                  p: 3,
                  borderRadius: 2,
                  mb: 2,
                  color: '#fff',
                  lineHeight: 1.8,
                  fontSize: '1rem'
                }}
              >
                <div id="report-content" className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {report}
                  </ReactMarkdown>
                </div>

              </Box>

              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => window.print()}>
                Download as PDF
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
}
