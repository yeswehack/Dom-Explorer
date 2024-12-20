import { stateParser, type DomExplorerState } from "~/types";

export function useSharedState() {
  const supabase = getSupabaseClient();

  async function createSharedState(state: DomExplorerState) {
    const response = await supabase.rpc("create_shared_state", {
      state: toRaw(state) as unknown as Json,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }

  async function getSharedState(id: string) {
    try {
      const { data } = await supabase.rpc("get_shared_state", {
        shared_id: id,
      });

      if (!data) {
        throw new Error("Invalid Link");
      }

      return stateParser.parse(data);
    } catch {
      throw "Invalid Link";
    }
  }

  return { createSharedState, getSharedState };
}
