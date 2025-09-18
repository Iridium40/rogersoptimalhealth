export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border bg-white p-6 text-xs leading-6 text-muted-foreground " +
        className
      }
    >
      <h2 className="text-sm font-semibold text-foreground">
        Important Disclaimers
      </h2>
      <p className="mt-2">
        *Average weight loss on the Optimal Weight 5 & 1 Plan® is 12 pounds.
        Clients are in weight loss, on average, for 12 weeks.
      </p>
      <p className="mt-2">
        *Medical advice, treatment, prescriptions, and the overall practice of
        medicine must be provided by a licensed healthcare professional. OPTAVIA
        and its coaches do not engage in or provide any medical services.
      </p>
      <p className="mt-2">
        Lenee Rogers is an Independent OPTAVIA Certified Health Coach. This website is independently operated by Lenee Rogers and is not affiliated with, endorsed by, or operated by OPTAVIA LLC. For official OPTAVIA information, please visit optavia.com.
      </p>
    </div>
  );
}
