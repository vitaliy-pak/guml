import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { fetchRepositories } from "./lib/github";
import UmlGenerationStepper from "./ui/uml/uml-generation-stepper";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!(session?.accessToken)) {
        return <p>Welcome to GUML! Please sign in to proceed.</p>;
    }

    const repos = await fetchRepositories(session.accessToken);

    return (
        <UmlGenerationStepper repos={repos} />
    );
};
