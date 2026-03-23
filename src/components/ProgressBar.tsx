import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  label: string;
  variant?: "primary" | "success" | "warning" | "destructive";
}

const variantClasses = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const ProgressBar = ({ value, label, variant = "primary" }: ProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-foreground font-medium">{label}</span>
      <span className="text-muted-foreground">{value}%</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${variantClasses[variant]}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  </div>
);

export default ProgressBar;
