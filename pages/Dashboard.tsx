import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardTitle, Input, Badge } from '../components/UI';
import { cn } from '../components/UI';
import { LogIn, LogOut, Mail, Building2, MessageSquare, Loader2, Shield } from 'lucide-react';

const API = '/api/admin';

type TabId = 'contacts' | 'companies' | 'feedback';

const tabs: { id: TabId; label: string; icon: React.ElementType; countKey: 'contacts' | 'companies' | 'feedback' }[] = [
  { id: 'contacts', label: 'Contact Inquiries', icon: Mail, countKey: 'contacts' },
  { id: 'companies', label: 'Job Postings', icon: Building2, countKey: 'companies' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, countKey: 'feedback' },
];

export const Dashboard: React.FC = () => {
  const [auth, setAuth] = useState<{ authenticated: boolean; username?: string } | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('contacts');
  const [contacts, setContacts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchAuth = async () => {
    try {
      const res = await fetch(`${API}/me`, { credentials: 'include' });
      const data = await res.json();
      setAuth(data);
      return data.authenticated;
    } catch {
      setAuth({ authenticated: false });
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await fetchAuth();
      if (cancelled) return;
      setLoading(false);
      if (ok) {
        setFetching(true);
        try {
          const [cRes, coRes, fRes] = await Promise.all([
            fetch(`${API}/contacts`, { credentials: 'include' }),
            fetch(`${API}/companies`, { credentials: 'include' }),
            fetch(`${API}/feedback`, { credentials: 'include' }),
          ]);
          if (!cancelled && cRes.ok) setContacts(await cRes.json());
          if (!cancelled && coRes.ok) setCompanies(await coRes.json());
          if (!cancelled && fRes.ok) setFeedback(await fRes.json());
        } catch (e) {
          console.error(e);
        } finally {
          if (!cancelled) setFetching(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }
      setAuth({ authenticated: true, username });
      setFetching(true);
      const [cRes, coRes, fRes] = await Promise.all([
        fetch(`${API}/contacts`, { credentials: 'include' }),
        fetch(`${API}/companies`, { credentials: 'include' }),
        fetch(`${API}/feedback`, { credentials: 'include' }),
      ]);
      if (cRes.ok) setContacts(await cRes.json());
      if (coRes.ok) setCompanies(await coRes.json());
      if (fRes.ok) setFeedback(await fRes.json());
      setFetching(false);
    } catch {
      setLoginError('Network error');
    }
  };

  const handleLogout = async () => {
    await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
    setAuth({ authenticated: false });
    setContacts([]);
    setCompanies([]);
    setFeedback([]);
  };

  const formatDate = (d: string) => (d ? new Date(d).toLocaleString() : '-');

  const counts = { contacts: contacts.length, companies: companies.length, feedback: feedback.length };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!auth?.authenticated) {
    return (
      <div className="max-w-md mx-auto py-12 sm:py-16 px-4">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Dashboard Login</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Enter your credentials to view submissions.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
              </div>
              {loginError && <p className="text-sm text-destructive" role="alert">{loginError}</p>}
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Log In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{auth.username}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="border-b border-border">
        <nav className="flex gap-0" role="tablist" aria-label="Dashboard sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = counts[tab.countKey];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge variant="secondary" className="ml-1 h-5 min-w-[1.25rem] justify-center text-xs">
                  {count}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>

      {fetching && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!fetching && (
        <div className="pt-6">
          {/* Contact Inquiries */}
          <div
            role="tabpanel"
            id="panel-contacts"
            aria-labelledby="tab-contacts"
            hidden={activeTab !== 'contacts'}
            className="animate-fade-in"
          >
            <Card>
              <CardContent className="p-0">
                {contacts.length === 0 ? (
                  <p className="p-6 text-muted-foreground text-sm">No contact inquiries yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-3 font-medium">Name</th>
                          <th className="p-3 font-medium">Email</th>
                          <th className="p-3 font-medium">Subject</th>
                          <th className="p-3 font-medium hidden md:table-cell">Message</th>
                          <th className="p-3 font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c._id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-medium">{c.name}</td>
                            <td className="p-3">{c.email}</td>
                            <td className="p-3">{c.subject}</td>
                            <td className="p-3 max-w-xs truncate hidden md:table-cell">{c.message}</td>
                            <td className="p-3 text-muted-foreground text-xs">{formatDate(c.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Job Postings */}
          <div
            role="tabpanel"
            id="panel-companies"
            aria-labelledby="tab-companies"
            hidden={activeTab !== 'companies'}
            className="animate-fade-in"
          >
            <Card>
              <CardContent className="p-0">
                {companies.length === 0 ? (
                  <p className="p-6 text-muted-foreground text-sm">No job postings yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {companies.map((j) => (
                      <li key={j._id} className="p-4 sm:p-6 hover:bg-muted/20">
                        <div className="font-semibold">{j.companyName} – {j.jobTitle}</div>
                        {(j.location || j.jobType) && (
                          <p className="text-sm text-muted-foreground mt-1">{[j.location, j.jobType].filter(Boolean).join(' · ')}</p>
                        )}
                        <p className="text-sm mt-2 line-clamp-2">{j.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(j.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback */}
          <div
            role="tabpanel"
            id="panel-feedback"
            aria-labelledby="tab-feedback"
            hidden={activeTab !== 'feedback'}
            className="animate-fade-in"
          >
            <Card>
              <CardContent className="p-0">
                {feedback.length === 0 ? (
                  <p className="p-6 text-muted-foreground text-sm">No feedback yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {feedback.map((f) => (
                      <li key={f._id} className="p-4 sm:p-6 hover:bg-muted/20">
                        <p className="text-sm">{f.feedback}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {f.overallScore != null && <span>Score: {f.overallScore}%</span>}
                          <span>{formatDate(f.createdAt)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
