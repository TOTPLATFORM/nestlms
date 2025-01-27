const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Language {
  id: number;
  code: string;
  name: string;
  direction: string;
  is_default: boolean;
  status: number;
  flag_icon: string;
  locale_code: string;
}

export interface Translation {
  [key: string]: string;
}

class LanguageService {
  private getHeaders() {
    return {
      "Content-Type": "application/json",
      apisecretkeycheck: process.env.NEXT_PUBLIC_API_SECRET,
    } as Record<string, string>;
  }

  async getActiveLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${BASE_URL}/public/languages/active`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching languages:", error);
      return [];
    }
  }

  async getSystemMessages(languageCode: string): Promise<Translation> {
    try {
      const response = await fetch(
        `${BASE_URL}/public/languages/system-messages?language=${languageCode}`,
        {
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching translations:", error);
      return {};
    }
  }

  async getTranslations(
    tableName: string,
    tableId: number,
    languageCode: string
  ): Promise<Translation> {
    try {
      const response = await fetch(
        `${BASE_URL}/translations/${tableName}/${tableId}?language=${languageCode}`,
        {
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching translations:", error);
      return {};
    }
  }

  async getMultipleTranslations(
    tableName: string,
    tableIds: number[],
    languageCode: string
  ): Promise<{ [key: number]: Translation }> {
    try {
      const queryString = tableIds.map((id) => `ids[]=${id}`).join("&");
      const response = await fetch(
        `${BASE_URL}/translations/${tableName}/multiple?${queryString}&language=${languageCode}`,
        {
          headers: this.getHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching translations:", error);
      return {};
    }
  }

  setPreferredLanguage(languageCode: string): void {
    document.cookie = `preferred_language=${languageCode};path=/;`;
    localStorage.setItem("preferred_language_code", languageCode);
  }

  getPreferredLanguage(): string {
    return (
      localStorage.getItem("preferred_language_code") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("preferred_language="))
        ?.split("=")[1] ||
      "en"
    );
  }
}

export const languageService = new LanguageService();
