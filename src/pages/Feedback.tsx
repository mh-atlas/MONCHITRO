import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, ArrowLeft, MessageSquare, Send, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AppHeader from '@/components/dashboard/AppHeader';

const ROLES = ['Health Planner', 'Researcher', 'NGO Staff', 'Clinician', 'Student', 'Other'];
const STAR_LABELS = ['', 'Very difficult', 'Difficult', 'Neutral', 'Easy', 'Very easy'];

const FEEDBACK_URL =
  'https://script.google.com/macros/s/AKfycbwkaAEdBUBKkSGwnfmTojHFQSHkX8SWYEtc8RddnPwJho3h2jFpRzvWeSaXz07rQVXOug/exec';

export default function Feedback() {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [useCase, setUseCase] = useState('');
  const [improvement, setImprovement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!role) e.role = 'Please select your role.';
    if (!rating) e.rating = 'Please give a rating.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      timestamp: new Date().toISOString(),
      role,
      rating,
      useCase,
      improvement,
      source: 'MONCHITRO feedback route',
    };

    try {
      await fetch(FEEDBACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      try {
        const raw = localStorage.getItem('monchitro_feedback_v1');
        const list = Array.isArray(JSON.parse(raw ?? '[]')) ? JSON.parse(raw ?? '[]') : [];
        list.push(payload);
        localStorage.setItem('monchitro_feedback_v1', JSON.stringify(list));
      } catch {
        // Ignore local backup failure.
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Could not send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />

        <main id="main-content" className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center animate-fade-in">
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
            </div>

            <h1 className="mb-2 text-xl font-bold text-foreground">
              Thank you for your feedback
            </h1>

            <p className="mb-8 text-sm text-muted-foreground">
              Your response has been recorded and will help improve the dashboard for health
              planners, researchers, and service organizations.
            </p>

            <Button onClick={() => navigate('/')} className="w-full px-8 sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main id="main-content" className="flex-1 flex items-start justify-center p-4 md:p-10">
        <div className="w-full max-w-xl animate-fade-in">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-foreground">Share your feedback</h1>
              <p className="text-xs text-muted-foreground">
                Anonymous feedback for dashboard improvement
              </p>
            </div>
          </div>

          <div className="mb-6 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/25 dark:text-blue-100">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs leading-relaxed">
              This feedback form supports informal dashboard improvement. It is not a formal
              usability study, System Usability Scale assessment, or representative evaluation.
              For data interpretation details, read the{' '}
              <Link to="/data-methods" className="font-semibold underline underline-offset-2">
                Data & Methods
              </Link>{' '}
              page.
            </p>
          </div>

          <div className="space-y-6">
            <div className="dashboard-panel space-y-3 p-5">
              <label className="block text-sm font-semibold text-foreground">
                I am a <span className="text-destructive">*</span>
              </label>

              <Select
                value={role}
                onValueChange={(v) => {
                  setRole(v);
                  setErrors((e) => ({ ...e, role: '' }));
                }}
              >
                <SelectTrigger
                  aria-label="Select your role"
                  aria-invalid={!!errors.role}
                  className={errors.role ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>

                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
            </div>

            <div className="dashboard-panel space-y-3 p-5">
              <label className="block text-sm font-semibold text-foreground">
                How easy was the dashboard to use? <span className="text-destructive">*</span>
              </label>

              <div className="flex items-center gap-2" role="radiogroup" aria-label="Ease of use rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setRating(n);
                      setErrors((e) => ({ ...e, rating: '' }));
                    }}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} star — ${STAR_LABELS[n]}`}
                    aria-checked={rating === n}
                    role="radio"
                    className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        n <= (hovered || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted stroke-muted-foreground/40'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}

                {(hovered || rating) > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    {STAR_LABELS[hovered || rating]}
                  </span>
                )}
              </div>

              {errors.rating && <p className="text-xs text-destructive">{errors.rating}</p>}
            </div>

            <div className="dashboard-panel space-y-3 p-5">
              <label className="block text-sm font-semibold text-foreground">
                What did you use the dashboard for?
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>

              <Textarea
                rows={4}
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="e.g. Finding mental health facilities in my district, comparing coverage across regions, planning resource allocation..."
                aria-label="Use case"
                className="resize-none text-sm"
              />
            </div>

            <div className="dashboard-panel space-y-3 p-5">
              <label className="block text-sm font-semibold text-foreground">
                What would you improve?
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>

              <Textarea
                rows={4}
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                placeholder="e.g. More granular data, clearer legends, service-type filters, better mobile layout..."
                aria-label="Improvement suggestion"
                className="resize-none text-sm"
              />
            </div>

            {submitError && (
              <p className="text-center text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}

            <div className="flex flex-col gap-3 pb-10 pt-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="sm:w-auto"
                disabled={submitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Cancel
              </Button>

              <Button onClick={handleSubmit} className="flex-1" disabled={submitting}>
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {submitting ? 'Sending...' : 'Submit feedback'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
