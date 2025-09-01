import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Trash2, Download, Upload, Link, Copy, Loader2, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://students-feedback-system-3.onrender.com';
const API = `${BACKEND_URL}/api`;

const AdminView = () => {
  const { user, logout } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [newForm, setNewForm] = useState({
    title: '',
    year: '',
    section: '',
    department: '',
    subjects: [''],
    evaluation_criteria: ['']
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/forms`);
      setForms(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch forms:', error);
      setError('Failed to load forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = () => {
    setNewForm({
      ...newForm,
      subjects: [...newForm.subjects, '']
    });
  };

  const removeSubject = (index) => {
    if (newForm.subjects.length > 1) {
      const updatedSubjects = newForm.subjects.filter((_, i) => i !== index);
      setNewForm({
        ...newForm,
        subjects: updatedSubjects
      });
    }
  };

  const updateSubject = (index, value) => {
    const updatedSubjects = [...newForm.subjects];
    updatedSubjects[index] = value;
    setNewForm({
      ...newForm,
      subjects: updatedSubjects
    });
  };

  const addCriteria = () => {
    setNewForm({
      ...newForm,
      evaluation_criteria: [...newForm.evaluation_criteria, '']
    });
  };

  const removeCriteria = (index) => {
    if (newForm.evaluation_criteria.length > 1) {
      const updatedCriteria = newForm.evaluation_criteria.filter((_, i) => i !== index);
      setNewForm({
        ...newForm,
        evaluation_criteria: updatedCriteria
      });
    }
  };

  const updateCriteria = (index, value) => {
    const updatedCriteria = [...newForm.evaluation_criteria];
    updatedCriteria[index] = value;
    setNewForm({
      ...newForm,
      evaluation_criteria: updatedCriteria
    });
  };

  const createForm = async () => {
    const { title, year, section, department, subjects, evaluation_criteria } = newForm;
    
    if (!title.trim() || !year.trim() || !section.trim() || !department.trim()) {
      setError('Please fill in all required fields (Title, Year, Section, Department)');
      return;
    }

    const validSubjects = subjects.filter(s => s.trim() !== '');
    const validCriteria = evaluation_criteria.filter(c => c.trim() !== '');

    if (validSubjects.length === 0 || validCriteria.length === 0) {
      setError('Please add at least one subject and one evaluation criteria');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const formData = {
        title: title.trim(),
        year: year.trim(),
        section: section.trim(),
        department: department.trim(),
        subjects: validSubjects,
        evaluation_criteria: validCriteria
      };

      const response = await axios.post(`${API}/forms`, formData);
      
      // Reset form
      setNewForm({
        title: '',
        year: '',
        section: '',
        department: '',
        subjects: [''],
        evaluation_criteria: ['']
      });

      setSuccess(`Form created successfully! Share this link: ${window.location.origin}/#/student/${response.data.id}`);
      
      // Refresh forms list
      await fetchForms();
      
    } catch (error) {
      console.error('Failed to create form:', error);
      setError(error.response?.data?.detail || 'Failed to create form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    // Fix shareable link to use current domain instead of localhost
    const currentDomain = window.location.origin;
    const formId = text.split('/').pop(); // Extract form ID from the URL
    const correctedUrl = `${currentDomain}/#/student/${formId}`;
    
    navigator.clipboard.writeText(correctedUrl).then(() => {
      setSuccess('Link copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    });
  };

  const exportFormData = async (formId) => {
    try {
      const response = await axios.get(`${API}/forms/${formId}/feedback`);
      const data = response.data;

      if (data.feedbacks.length === 0) {
        setError('No feedback data to export for this form.');
        return;
      }

      const workbook = XLSX.utils.book_new();

      // Create summary sheet
      const summaryData = [
        [`Feedback Summary - ${data.form_title}`],
        [`${data.year} ${data.department} - Section ${data.section}`],
        [`Total Responses: ${data.total_responses}`],
        [''],
        ['Subject-wise Average Ratings:'],
        ...Object.entries(data.average_ratings_per_subject).map(([subject, rating]) => [
          subject, rating.toFixed(2)
        ]),
        [''],
        ['Individual Student Responses:'],
        ['Student ID', 'Student Name', 'Submitted On', 'Comments', ...Object.keys(data.average_ratings_per_subject)]
      ];

      // Add individual responses
      data.feedbacks.forEach(feedback => {
        const row = [
          feedback.student_id,
          feedback.student_name || 'Not provided',
          new Date(feedback.submitted_at).toLocaleString(),
          feedback.comments || 'No comments'
        ];
        
        // Add average ratings for each subject
        Object.keys(data.average_ratings_per_subject).forEach(subject => {
          row.push(feedback.averages[subject] ? feedback.averages[subject].toFixed(2) : 'N/A');
        });
        
        summaryData.push(row);
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Create detailed sheet with all ratings
      if (data.feedbacks.length > 0) {
        const firstFeedback = data.feedbacks[0];
        const subjects = Object.keys(firstFeedback.ratings);
        const criteria = Object.keys(firstFeedback.ratings[subjects[0]] || {});

        const detailedData = [
          [`Detailed Feedback - ${data.form_title}`],
          [`${data.year} ${data.department} - Section ${data.section}`],
          [''],
          ['Student ID', 'Student Name', 'Submitted On', ...subjects.flatMap(subject => 
            criteria.map(criterion => `${subject} - ${criterion}`)
          ), 'Comments']
        ];

        data.feedbacks.forEach(feedback => {
          const row = [
            feedback.student_id,
            feedback.student_name || 'Not provided',
            new Date(feedback.submitted_at).toLocaleString()
          ];
          
          subjects.forEach(subject => {
            criteria.forEach(criterion => {
              row.push(feedback.ratings[subject]?.[criterion] || 'N/A');
            });
          });
          
          row.push(feedback.comments || 'No comments');
          detailedData.push(row);
        });

        const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed');
      }

      const fileName = `Feedback_${data.year}_${data.department}_${data.section}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      setSuccess('Feedback data exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Failed to export data:', error);
      setError('Failed to export data. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log('Uploaded feedback data:', data);
        setSuccess('Feedback file uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error reading file:', error);
        setError('Error reading file. Please ensure it\'s a valid Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{
      width: '100%',
      maxWidth: '100%', 
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8" style={{
        width: '100%',
        maxWidth: '72rem',
        margin: '0 auto',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        paddingTop: '1rem',
        paddingBottom: '1rem'
      }}>
        {/* Header */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Welcome, <span className="font-medium text-blue-600">{user?.username}</span> - Manage feedback forms and view submissions
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={logout} 
                className="text-red-600 hover:text-red-700 shrink-0"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="create" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-2 h-auto" style={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            padding: '0.5rem',
            height: 'auto',
            '@media (min-width: 1024px)': {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          }}>
            <TabsTrigger value="create" className="text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-4 py-2 whitespace-nowrap" style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              Create Form
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-4 py-2 whitespace-nowrap" style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              Manage ({forms.length})
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-4 py-2 whitespace-nowrap" style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-4 py-2 whitespace-nowrap" style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              Export Data
            </TabsTrigger>
          </TabsList>

          {/* Create New Form */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Create New Feedback Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Form Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mid-Semester Feedback"
                      value={newForm.title}
                      onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                      disabled={submitting}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department *</Label>
                    <Input
                      id="department"
                      placeholder="e.g., ECE, CSE, MECH"
                      value={newForm.department}
                      onChange={(e) => setNewForm({...newForm, department: e.target.value})}
                      disabled={submitting}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">Year *</Label>
                    <Input
                      id="year"
                      placeholder="e.g., 3rd Year, 4th Year"
                      value={newForm.year}
                      onChange={(e) => setNewForm({...newForm, year: e.target.value})}
                      disabled={submitting}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="section" className="text-sm font-medium text-gray-700">Section *</Label>
                    <Input
                      id="section"
                      placeholder="e.g., A, B, C"
                      value={newForm.section}
                      onChange={(e) => setNewForm({...newForm, section: e.target.value})}
                      disabled={submitting}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <Label className="text-lg font-medium">
                    Subjects
                  </Label>
                  <div className="space-y-2 mt-2">
                    {newForm.subjects.map((subject, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Subject ${index + 1}`}
                          value={subject}
                          onChange={(e) => updateSubject(index, e.target.value)}
                          disabled={submitting}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSubject(index)}
                          disabled={newForm.subjects.length === 1 || submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addSubject} 
                      className="w-full"
                      disabled={submitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div>
                  <Label className="text-lg font-medium">
                    Evaluation Criteria
                  </Label>
                  <div className="space-y-2 mt-2">
                    {newForm.evaluation_criteria.map((criteria, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Evaluation criteria ${index + 1}`}
                          value={criteria}
                          onChange={(e) => updateCriteria(index, e.target.value)}
                          disabled={submitting}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCriteria(index)}
                          disabled={newForm.evaluation_criteria.length === 1 || submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addCriteria} 
                      className="w-full"
                      disabled={submitting}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criteria
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={createForm} 
                  className="w-full" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Form...
                    </>
                  ) : (
                    'Create Feedback Form'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Forms */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Manage Forms ({forms.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {forms.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No forms created yet</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first feedback form to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {forms.map(form => (
                      <div key={form.id} className="p-4 sm:p-6 border rounded-lg">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg sm:text-xl text-gray-900 truncate">{form.title}</h3>
                            <p className="text-blue-600 font-medium text-sm sm:text-base mt-1">
                              {form.year} {form.department} - Section {form.section}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              Created: {new Date(form.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="secondary" className="text-xs sm:text-sm">
                              {form.response_count} responses
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {form.subjects.map((subject, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{subject}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Evaluation Criteria: {form.evaluation_criteria.length} items
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(form.shareable_link)}
                            className="flex-1 sm:flex-none text-sm font-medium px-4 py-2 h-10 justify-center"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportFormData(form.id)}
                            disabled={form.response_count === 0}
                            className="flex-1 sm:flex-none text-sm font-medium px-4 py-2 h-10 justify-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export ({form.response_count})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Data */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Upload Student Feedback Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Only Excel files (.xlsx, .xls) are supported</li>
                      <li>• Ensure your file contains valid feedback data</li>
                      <li>• File will be processed automatically after upload</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="fileUpload" className="text-sm font-medium text-gray-700">Select Excel File</Label>
                    <div className="mt-2">
                      <input
                        id="fileUpload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Feedback File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Data */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Export All Feedback Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 text-sm sm:text-base">
                      Export feedback data for individual forms using the "Export Data" button in the Manage Forms section.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600">{forms.length}</div>
                        <p className="text-sm text-gray-600">Total Forms</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                          {forms.reduce((total, form) => total + form.response_count, 0)}
                        </div>
                        <p className="text-sm text-gray-600">Total Responses</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm sm:text-base">Use the individual export buttons in the "Manage Forms" tab to export data per section.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminView;