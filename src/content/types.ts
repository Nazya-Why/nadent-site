import type { Localized } from "@/i18n/config";
import type { ImageId } from "./image-registry";

export type ServiceId =
  | "implants"
  | "all-on-4"
  | "veneers"
  | "aligners"
  | "braces"
  | "whitening"
  | "hygiene"
  | "caries"
  | "endodontics"
  | "prosthetics"
  | "surgery"
  | "kids"
  | "sedation"
  | "emergency";

export type ProblemId = "missing-tooth" | "smile" | "crooked" | "pain" | "kids" | "fear" | "prevention";

export type ServiceCategory = "restoration" | "aesthetics" | "orthodontics" | "treatment" | "prevention" | "special";

export type DoctorId =
  | "andrii-solovii"
  | "olena-kovalchuk"
  | "marta-hnatyshyn"
  | "taras-boiko"
  | "iryna-savchuk"
  | "ostap-klymko"
  | "sofiia-dmytruk"
  | "roman-levytskyi"
  | "yuliia-panchyshyn";

export type TechId = "ct" | "scanner" | "microscope" | "cadcam" | "laser" | "sedation" | "sterilization";

export type IconName =
  | "implant"
  | "arch"
  | "sparkle"
  | "aligner"
  | "braces"
  | "sun"
  | "droplet"
  | "shield"
  | "microscope"
  | "crown"
  | "scalpel"
  | "child"
  | "moon"
  | "siren"
  | "heart"
  | "smile"
  | "tooth-gap"
  | "zigzag";

/** Short card-level description of a service, available in every locale. */
export interface ServiceSummaryText {
  name: string;
  /** Name inside sentences / CTA: "консультацію з імплантації" */
  ctaObject: string;
  short: string;
  duration: string;
  guarantee?: string;
}

export interface ServiceBase {
  id: ServiceId;
  slug: Localized<string>;
  category: ServiceCategory;
  problems: ProblemId[];
  icon: IconName;
  priceFrom: number;
  /** Suffix for the price: per tooth, per arch… */
  priceUnit?: Localized<string>;
  image: ImageId;
  doctorIds: DoctorId[];
  techIds: TechId[];
  related: ServiceId[];
  text: Localized<ServiceSummaryText>;
}

export interface Service extends Omit<ServiceBase, "slug" | "text" | "priceUnit"> {
  slug: string;
  slugs: Localized<string>;
  priceUnit?: string;
  text: ServiceSummaryText;
}

export interface FaqItem {
  q: string;
  a: string;
}
