import React from 'react';
import { Typography } from '@/components/ui/Typography';

export default function TypographyShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="text-center">
        <Typography.Display className="mb-4 text-indigo-600">
          Typography System
        </Typography.Display>
        <Typography.Body className="text-slate-600 max-w-2xl mx-auto">
          Hệ thống Typography thống nhất cho toàn bộ frontend, đảm bảo tính nhất quán về font-size, line-height và spacing.
        </Typography.Body>
      </header>

      {/* Typography Scale */}
      <section>
        <Typography.Title className="mb-6 text-slate-900">Typography Scale</Typography.Title>
        
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography.Headline className="mb-3 text-slate-800">Display & Headings</Typography.Headline>
              <div className="space-y-3">
                <div>
                  <Typography.Display>Display (36px)</Typography.Display>
                  <Typography.Caption className="text-slate-500">Hero headings, landing pages</Typography.Caption>
                </div>
                <div>
                  <Typography.Title>Title (24px)</Typography.Title>
                  <Typography.Caption className="text-slate-500">Page titles, main headings</Typography.Caption>
                </div>
                <div>
                  <Typography.Headline>Headline (20px)</Typography.Headline>
                  <Typography.Caption className="text-slate-500">Section headings</Typography.Caption>
                </div>
                <div>
                  <Typography.Subheading>Subheading (18px)</Typography.Subheading>
                  <Typography.Caption className="text-slate-500">Sub-section headings</Typography.Caption>
                </div>
              </div>
            </div>

            <div>
              <Typography.Headline className="mb-3 text-slate-800">Body & Support</Typography.Headline>
              <div className="space-y-3">
                <div>
                  <Typography.Body>Body Text (15px)</Typography.Body>
                  <Typography.Caption className="text-slate-500">Main content, paragraphs</Typography.Caption>
                </div>
                <div>
                  <Typography.Caption>Caption Text (11px)</Typography.Caption>
                  <Typography.Caption className="text-slate-500">Metadata, timestamps</Typography.Caption>
                </div>
                <div>
                  <Typography.Overline>OVERLINE TEXT</Typography.Overline>
                  <Typography.Caption className="text-slate-500">Labels, badges, categories</Typography.Caption>
                </div>
                <div>
                  <Typography.Code>Code Text</Typography.Code>
                  <Typography.Caption className="text-slate-500">Inline code, values</Typography.Caption>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section>
        <Typography.Title className="mb-6 text-slate-900">Font Weights</Typography.Title>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="font-light">Light (300)</div>
            <div className="font-normal">Normal (400)</div>
            <div className="font-medium">Medium (500)</div>
            <div className="font-semibold">Semibold (600)</div>
            <div className="font-bold">Bold (700)</div>
            <div className="font-extrabold">Extrabold (800)</div>
          </div>
        </div>
      </section>

      {/* Specialized Classes */}
      <section>
        <Typography.Title className="mb-6 text-slate-900">Specialized Classes</Typography.Title>
        
        <div className="space-y-6">
          {/* Buttons */}
          <div className="bg-white p-6 rounded-lg border">
            <Typography.Headline className="mb-4 text-slate-800">Button Typography</Typography.Headline>
            <div className="flex flex-wrap gap-4">
              <button className="btn-text bg-indigo-600 text-white px-4 py-2 rounded-lg">
                Primary Button
              </button>
              <button className="btn-text-lg bg-slate-200 text-slate-900 px-4 py-2 rounded-lg">
                Large Button
              </button>
              <button className="btn-text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded">
                Small Button
              </button>
            </div>
          </div>

          {/* Form Elements */}
          <div className="bg-white p-6 rounded-lg border">
            <Typography.Headline className="mb-4 text-slate-800">Form Typography</Typography.Headline>
            <div className="space-y-4 max-w-md">
              <div>
                <Typography.Label htmlFor="email" className="block mb-2">
                  Email Address
                </Typography.Label>
                <input 
                  type="email" 
                  id="email" 
                  className="input-text w-full p-3 border border-slate-200 rounded-lg" 
                  placeholder="Enter your email"
                />
                <Typography.HelperText className="mt-1 block">
                  We'll never share your email with anyone else.
                </Typography.HelperText>
              </div>

              <div>
                <Typography.Label htmlFor="password" className="block mb-2">
                  Password
                </Typography.Label>
                <input 
                  type="password" 
                  id="password" 
                  className="input-text w-full p-3 border border-red-200 rounded-lg" 
                  placeholder="Enter password"
                />
                <Typography.ErrorText className="mt-1 block">
                  Password must be at least 8 characters long.
                </Typography.ErrorText>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <Typography.Title className="mb-6 text-slate-900">Usage Examples</Typography.Title>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Example */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <Typography.Overline className="text-indigo-600 mb-2">
              PROJECT CARD
            </Typography.Overline>
            <Typography.Headline className="mb-2 text-slate-900">
              E-commerce Platform
            </Typography.Headline>
            <Typography.Body className="text-slate-600 mb-4">
              A modern e-commerce platform built with React and Node.js featuring real-time inventory management.
            </Typography.Body>
            <div className="flex items-center justify-between">
              <Typography.Caption className="text-slate-500">
                Updated 2 hours ago
              </Typography.Caption>
              <Typography.Caption className="bg-green-100 text-green-700 px-2 py-1 rounded">
                85% Complete
              </Typography.Caption>
            </div>
          </div>

          {/* Navigation Example */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <Typography.Overline className="text-slate-400 mb-4">
              NAVIGATION
            </Typography.Overline>
            <nav className="space-y-2">
              <div className="text-subheading font-medium text-slate-900 py-2">Dashboard</div>
              <div className="text-subheading font-medium text-slate-600 py-2 hover:text-slate-900 cursor-pointer">Projects</div>
              <div className="text-subheading font-medium text-slate-600 py-2 hover:text-slate-900 cursor-pointer">Tasks</div>
              <div className="text-subheading font-medium text-slate-600 py-2 hover:text-slate-900 cursor-pointer">Settings</div>
            </nav>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="bg-slate-50 p-6 rounded-lg">
        <Typography.Title className="mb-4 text-slate-900">Best Practices</Typography.Title>
        <div className="space-y-3">
          <Typography.Body>
            <strong>1. Use semantic components</strong> - Prefer <Typography.Code>Typography.Title</Typography.Code> over utility classes when possible
          </Typography.Body>
          <Typography.Body>
            <strong>2. Maintain hierarchy</strong> - Don't skip levels (Display → Title → Headline → Subheading)
          </Typography.Body>
          <Typography.Body>
            <strong>3. Be consistent</strong> - Use the same patterns across components
          </Typography.Body>
          <Typography.Body>
            <strong>4. Test readability</strong> - Ensure good contrast and appropriate line-height
          </Typography.Body>
        </div>
      </section>
    </div>
  );
}