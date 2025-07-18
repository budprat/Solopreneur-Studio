import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Mail, Inbox, Send, Star, Clock, AlertCircle, CheckCircle, TrendingUp, Filter, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailAnalysis {
  id: number;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  receivedAt: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'project_request' | 'follow_up' | 'payment' | 'support' | 'other';
  extractedData: {
    budget?: string;
    timeline?: string;
    requirements?: string[];
    clientName?: string;
    projectType?: string;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions: string[];
  autoResponse?: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  category: string;
  useCount: number;
}

export default function EmailIntelligence() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailAnalysis | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const { toast } = useToast();

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["/api/emails", filterCategory, filterUrgency],
    select: (data) => data as EmailAnalysis[],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/email-templates"],
    select: (data) => data as EmailTemplate[],
  });

  const processEmailMutation = useMutation({
    mutationFn: async (emailId: number) => {
      return await apiRequest(`/api/emails/${emailId}/process`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      toast({
        title: "Email processed successfully",
        description: "AI analysis completed and actions suggested.",
      });
    },
  });

  const sendResponseMutation = useMutation({
    mutationFn: async (data: { emailId: number; response: string }) => {
      return await apiRequest(`/api/emails/${data.emailId}/respond`, {
        method: "POST",
        body: JSON.stringify({ response: data.response }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      toast({
        title: "Response sent successfully",
        description: "Your email has been sent and marked as responded.",
      });
      setSelectedEmail(null);
    },
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const mockEmails: EmailAnalysis[] = [
    {
      id: 1,
      subject: "Project Proposal - AI Website Integration",
      sender: "sarah.chen@techstartup.com",
      recipient: "me@soloai.studio",
      content: "Hi, I'm interested in integrating AI capabilities into our e-commerce platform. We have a budget of $25,000 and need to launch by Q2 2025. Can you help us build a recommendation engine and chatbot?",
      receivedAt: "2025-01-18T09:30:00Z",
      urgency: 'high',
      category: 'project_request',
      extractedData: {
        budget: "$25,000",
        timeline: "Q2 2025",
        requirements: ["recommendation engine", "chatbot", "e-commerce integration"],
        clientName: "Sarah Chen",
        projectType: "AI Integration"
      },
      sentiment: 'positive',
      suggestedActions: [
        "Schedule discovery call",
        "Send project proposal template",
        "Create project in SoloAI Studio"
      ],
      autoResponse: "Thank you for your interest in AI integration. I'd love to discuss your requirements in detail. I have availability this week for a discovery call.",
      status: 'unread'
    },
    {
      id: 2,
      subject: "Follow-up on Marketing Campaign Project",
      sender: "mike.johnson@digitalagency.com",
      recipient: "me@soloai.studio",
      content: "Hi, just checking in on the progress of our AI-powered marketing campaign. The client is excited to see the results. When can we expect the first draft?",
      receivedAt: "2025-01-18T14:15:00Z",
      urgency: 'medium',
      category: 'follow_up',
      extractedData: {
        clientName: "Mike Johnson",
        projectType: "Marketing Campaign"
      },
      sentiment: 'neutral',
      suggestedActions: [
        "Send progress update",
        "Schedule status meeting",
        "Update project timeline"
      ],
      status: 'read'
    }
  ];

  const displayEmails = emails.length > 0 ? emails : mockEmails;
  const filteredEmails = displayEmails.filter(email => {
    const categoryMatch = filterCategory === 'all' || email.category === filterCategory;
    const urgencyMatch = filterUrgency === 'all' || email.urgency === filterUrgency;
    return categoryMatch && urgencyMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered email analysis with automatic client request extraction
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Bot className="w-4 h-4 mr-2" />
            Auto-Respond
          </Button>
        </div>
      </div>

      {/* Email Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayEmails.length}</div>
            <p className="text-xs text-muted-foreground">+23% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Project Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayEmails.filter(e => e.category === 'project_request').length}
            </div>
            <p className="text-xs text-muted-foreground">+45% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">-15min from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Email Inbox</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="project_request">Project Requests</SelectItem>
                          <SelectItem value="follow_up">Follow-ups</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Urgency</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedEmail?.id === email.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => setSelectedEmail(email)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${getUrgencyColor(email.urgency)}`} />
                              <Badge variant="secondary" className="text-xs">
                                {email.category.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {email.urgency}
                              </Badge>
                            </div>
                            <h3 className="font-medium truncate">{email.subject}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              From: {email.sender}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(email.receivedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {email.status === 'unread' && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                            {email.status === 'responded' && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Email Details */}
            <div>
              {selectedEmail ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedEmail.sender}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getSentimentColor(selectedEmail.sentiment)}>
                        {selectedEmail.sentiment}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{selectedEmail.content}</p>
                    </div>

                    {/* Extracted Data */}
                    {selectedEmail.extractedData && Object.keys(selectedEmail.extractedData).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Extracted Information</h4>
                        <div className="space-y-1 text-sm">
                          {selectedEmail.extractedData.budget && (
                            <div>Budget: <span className="font-medium">{selectedEmail.extractedData.budget}</span></div>
                          )}
                          {selectedEmail.extractedData.timeline && (
                            <div>Timeline: <span className="font-medium">{selectedEmail.extractedData.timeline}</span></div>
                          )}
                          {selectedEmail.extractedData.requirements && (
                            <div>Requirements: <span className="font-medium">{selectedEmail.extractedData.requirements.join(', ')}</span></div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Suggested Actions */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Suggested Actions</h4>
                      <div className="space-y-1">
                        {selectedEmail.suggestedActions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{action}</span>
                            <Button size="sm" variant="outline">
                              Do
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Auto Response */}
                    {selectedEmail.autoResponse && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Suggested Response</h4>
                        <Textarea
                          value={selectedEmail.autoResponse}
                          className="min-h-[100px]"
                          readOnly
                        />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => sendResponseMutation.mutate({
                            emailId: selectedEmail.id,
                            response: selectedEmail.autoResponse
                          })}>
                            <Send className="w-4 h-4 mr-2" />
                            Send Response
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Response
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select an email</h3>
                    <p className="text-muted-foreground">
                      Choose an email from the list to view details and AI analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Analysis Dashboard</CardTitle>
              <CardDescription>
                Insights and patterns from your email communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed email patterns and client insights coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Pre-written responses for common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Smart templates with dynamic content coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Automation</CardTitle>
              <CardDescription>
                Automated workflows and smart routing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Smart Automation</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced email automation features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}