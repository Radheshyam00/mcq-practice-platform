import { mockTests } from "@/data/mockTests";
import { TestCard } from "@/components/mock-test/TestCard";
export default function MockTestsPage(){return <div className="mx-auto max-w-7xl px-4 py-12"><h1 className="text-4xl font-black">Mock Tests</h1><p className="mt-2 text-slate-500">Timed tests designed to simulate exam conditions.</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{mockTests.map(t=><TestCard key={t.id} {...t}/>)}</div></div>;}
