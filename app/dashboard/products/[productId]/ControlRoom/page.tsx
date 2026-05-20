import { Suspense } from "react";
import ControlRoomClient from "./ControlRoomClient";

type ControlRoomPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ControlRoomPage({ params }: ControlRoomPageProps) {
  const { productId } = await params;

  return (
    <Suspense
      fallback={
        <p className="p-8 text-sm text-gray-500">Loading control room...</p>
      }
    >
      <ControlRoomClient productId={productId} />
    </Suspense>
  );
}
