/**
 * Consistent page heading block.
 */
export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-5xl font-semibold tracking-normal">{title}</h1>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
  </div>
);
