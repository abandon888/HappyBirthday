# Skill evaluation protocol

Run every case in `evals.json` twice from a clean repository copy:

1. explicitly invoke `$happy-birthday-maker` and save the generated-site path, final response, and validation output as the **with-skill** result;
2. run the identical prompt without invoking the Skill and save the equivalent evidence as the **baseline** result.

Grade each result against the case's `assertions`. A successful release candidate requires the with-skill result to pass every safety and generation assertion. The baseline is retained to show whether the Skill materially improves deterministic validation, source-tree preservation, local-only preview, and deployment refusal; it is not a requirement that the baseline fail.

Use a fresh temporary output directory for each run. Do not use personal photos, messages, credentials, deployment accounts, or external resource URLs in recorded evaluation artifacts.
