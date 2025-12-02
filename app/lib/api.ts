const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAgentById(agentId: string) {
  const response = await fetch(
    `${API_URL}/kaiSaas_agent_getAgentById?id=${agentId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch agent");
  }

  return response.json();
}

export async function getAgentsByUserId(userId: string) {
  const response = await fetch(
    `${API_URL}/kaiSaas_agent_getAgentsByUserId?userId=${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  return response.json();
}

export async function updateAgent(agentId: string, data: any) {
  const response = await fetch(`${API_URL}/kaiSaas_agent_updateAgent`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agentId, ...data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent");
  }

  return response.json();
}
