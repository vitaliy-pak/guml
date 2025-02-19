import { getServerSession } from "next-auth";
import { fetchRepositories } from "./lib/github";
import UmlGenerationStepper from "./ui/uml/uml-generation-stepper";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!(session?.accessToken)) {
        return redirect('/auth/signin');
    }

    const repos = await fetchRepositories(session.accessToken);

    return (
        <UmlGenerationStepper repos={repos}/>
    );
};
