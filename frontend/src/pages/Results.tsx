import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DownloadMenu } from "@/components/results/DownloadMenu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { usePlanStore } from "@/store/planStore";

type Tab = "product" | "market" | "tech";

interface Section {
  id: string;
  title: string;
  level: number;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("product");
  const [activeSection, setActiveSection] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const plan = usePlanStore((state) => (id ? state.plans[id] : undefined));
  const hydrated = usePlanStore((state) => state.hydrated);
  const loading = usePlanStore((state) => state.loading);

  useEffect(() => {
    if (!hydrated || loading) return;
    if (!plan) {
      navigate("/");
    }
  }, [plan, hydrated, loading, navigate]);

  useEffect(() => {
    if (!plan) return;

    const markdown = plan.results[activeTab] || "";
    const headings: Section[] = [];
    let inCodeBlock = false;

    for (const line of markdown.split("\n")) {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const match = line.match(/^(#{1,2})\s+(.*)$/);
      if (match) {
        const title = match[2].trim();
        headings.push({ id: slugify(title), title, level: match[1].length });
      }
    }

    setSections(headings);
  }, [plan, activeTab]);

  if (!hydrated || loading) {
    return null;
  }

  if (!plan) {
    return null;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "product", label: "Product" },
    { id: "market", label: "Market" },
    { id: "tech", label: "Tech" },
  ];

  const currentMarkdown = plan.results[activeTab] || "";

  const handleRerun = () => {
    navigate("/");
  };

  const handleDownloadMarkdown = () => {
    const markdown = currentMarkdown;
    const sanitizedIdea = plan.idea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);
    const fileName = `${sanitizedIdea}-${activeTab}-plan.md`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      element.classList.add("pdf-export");
      element.scrollIntoView({ block: "start" });

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        onclone: (_doc, clonedElement) => {
          clonedElement.classList.add("pdf-export");
        },
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("PDF capture produced an empty canvas");
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const sanitizedIdea = plan.idea
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);
      const fileName = `${sanitizedIdea}-${activeTab}-plan.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      contentRef.current?.classList.remove("pdf-export");
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <NavLink to="/history">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to History
              </Button>
            </NavLink>
            <Button variant="secondary" size="sm" onClick={handleRerun}>
              <RefreshCw className="w-4 h-4" />
              Re-run
            </Button>
          </div>
          <h1 className="text-2xl font-medium mb-2">{plan.idea}</h1>
          <p className="text-text-secondary">
            Completed {new Date(plan.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="border-b border-border mb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveSection("");
                  }}
                  className={`-mb-px pb-3 border-b-[3px] text-sm transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "!border-primary-hover font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pb-3">
              <DownloadMenu
                onDownloadMarkdown={handleDownloadMarkdown}
                onDownloadPDF={handleDownloadPDF}
                isDownloading={isDownloading}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-sm font-medium text-muted mb-4">Contents</h3>
              {sections.length === 0 && <p className="text-sm text-muted">No sections</p>}
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section.id);
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`block text-sm py-1 transition-colors ${
                    section.level > 1 ? "pl-3" : ""
                  } ${
                    activeSection === section.id
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-3">
            <article ref={contentRef} className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => {
                    const id = slugify(String(children));
                    return (
                      <h1
                        id={id}
                        className="text-2xl font-medium mb-6 mt-12 first:mt-0 text-foreground scroll-mt-24"
                        {...props}
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ children, ...props }) => {
                    const id = slugify(String(children));
                    return (
                      <h2
                        id={id}
                        className="text-xl font-medium mb-4 mt-8 text-foreground scroll-mt-24"
                        {...props}
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children, ...props }) => (
                    <h3 className="text-lg font-medium mb-3 mt-6 text-foreground" {...props}>
                      {children}
                    </h3>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-text-secondary leading-relaxed mb-4" {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul
                      className="list-disc list-inside space-y-2 mb-4 text-text-secondary"
                      {...props}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol
                      className="list-decimal list-inside space-y-2 mb-4 text-text-secondary"
                      {...props}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="text-text-secondary" {...props}>
                      {children}
                    </li>
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="font-medium text-foreground" {...props}>
                      {children}
                    </strong>
                  ),
                  em: ({ children, ...props }) => (
                    <em className="italic text-text-secondary" {...props}>
                      {children}
                    </em>
                  ),
                  code: ({ children, ...props }) => (
                    <code
                      className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-accent"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                  pre: ({ children, ...props }) => (
                    <pre
                      className="bg-surface border border-border rounded-lg p-4 overflow-x-auto mb-6 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className="border-l-4 border-accent pl-4 py-2 my-6 bg-accent/5 rounded-r-lg"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: ({ ...props }) => <hr className="border-border my-8" {...props} />,
                  a: ({ children, ...props }) => (
                    <a
                      className="text-accent hover:text-accent-end underline transition-colors"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border border-border rounded-lg" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children, ...props }) => (
                    <thead className="bg-surface" {...props}>
                      {children}
                    </thead>
                  ),
                  th: ({ children, ...props }) => (
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border"
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td
                      className="px-4 py-3 text-sm text-text-secondary border-b border-border"
                      {...props}
                    >
                      {children}
                    </td>
                  ),
                }}
              >
                {currentMarkdown}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
