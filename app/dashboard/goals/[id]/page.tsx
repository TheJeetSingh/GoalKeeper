import { use } from "react"
import { GoalDetailClient } from "./goal-detail-client"

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const id = use(Promise.resolve(params.id))
  return <GoalDetailClient id={id} />
}

