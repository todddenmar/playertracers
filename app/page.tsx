import FacilitiesList from "@/components/home/FacilitiesList";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1>PlayerTracers</h1>
      <div>
        <FacilitiesList />
      </div>
    </div>
  );
}
