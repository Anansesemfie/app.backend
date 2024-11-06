import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";
import { PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY } from "./env";
type METADATA = {
  customer: {
    id: string;
    name: string;
  };
  subscription: {
    id: string;
    duration: number;
  };
};

type PAYSTACK_INIT_RESPONSE = {
  status: boolean;
  message: string;
  data: {
    authorization_url: URL;
    access_code: string;
    reference: string;
  };
};

type PAYSTACK_VERIFY_RESPONSE = {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: string;
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: {
        type: string;
        message: string;
        time: number;
      }[];
    };
    fees: number;
    fees_split: any | null;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any | null;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any | null;
    split: any;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any | null;
    source: any | null;
    fees_breakdown: any | null;
    connect: any | null;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
};

class Paystack {
  private readonly publicKey = PAYSTACK_PUBLIC_KEY;
  private readonly secretKey = PAYSTACK_SECRET_KEY;
  private logInfo: string | null = null;
  private serviceName = "Paystack";

  constructor() {
    if (!this.publicKey || !this.secretKey) {
      throw new Error("Paystack keys not found");
    }
  }

  public async initializeTransaction(
    amount: number,
    email: string,
    metadata: METADATA,
    callback_url: string | null = null
  ): Promise<PAYSTACK_INIT_RESPONSE> {
    try {
      if (!amount || !email) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "missing required fields for transaction initialization"
        );
      }
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount * 100,
            email,
            metadata,
            callback_url,
          }),
        }
      );
      const data: PAYSTACK_INIT_RESPONSE = await response.json();
      if (!data.status) {
        throw await errorHandler.CustomError(ErrorEnum[400], data.message);
      }

      this.logInfo = `${
        HELPERS.loggerInfo.success
      } initializing transaction @ ${HELPERS.currentTime()}`;

      if (!data.status) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } initializing transaction @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string, this.serviceName);
      this.logInfo = null;
    }
  }

  public async verifyTransaction(
    reference: string
  ): Promise<PAYSTACK_VERIFY_RESPONSE> {
    try {
      if (!reference) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "missing required fields for transaction verification"
        );
      }

      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data: PAYSTACK_VERIFY_RESPONSE = await response.json();
      if (!data.status) {
        throw await errorHandler.CustomError(ErrorEnum[400], data.message);
      }
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } verifying transaction @ ${HELPERS.currentTime()}`;

      if (!data.status) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } verifying transaction @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string, this.serviceName);
      this.logInfo = null;
    }
  }
}

export default new Paystack();
