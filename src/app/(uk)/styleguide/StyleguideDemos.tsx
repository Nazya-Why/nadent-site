"use client";

import { useState } from "react";
import { Checkbox, ChoiceCard, PhoneField, Segmented, TextArea, TextField } from "@/components/forms/fields";
import { Switch } from "@/components/layout/ConsentManager";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/components/ui/Icon";

export function FormDemos() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [channel, setChannel] = useState<"call" | "telegram" | "viber" | "whatsapp">("call");
  const [choice, setChoice] = useState("implants");
  const [sw, setSw] = useState(true);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <TextField label="Ім'я (default)" placeholder="Олена" />
        <TextField label="Ім'я (filled)" defaultValue="Олена Коваль" />
        <TextField label="Ім'я (error)" defaultValue="О" error="Вкажіть, будь ласка, ваше ім'я" />
        <TextField label="Ім'я (disabled)" disabled defaultValue="Недоступно" />
        <TextField label="З підказкою" hint="Так до вас звертатиметься адміністратор" optional="необовʼязково" />
        <PhoneField label="Телефон (маска +380)" name="demo-phone" value={phone} onChange={setPhone} />
        <TextArea label="Коментар" optional="необовʼязково" placeholder="Що турбує…" />
      </div>
      <div className="flex flex-col gap-6">
        <Segmented
          name="demo-channel"
          legend="Segmented control"
          value={channel}
          onChange={setChannel}
          options={[
            { value: "call", label: "Дзвінок" },
            { value: "telegram", label: "Telegram" },
            { value: "viber", label: "Viber" },
            { value: "whatsapp", label: "WhatsApp", disabled: true },
          ]}
        />
        <Checkbox name="demo-consent" checked={consent} onChange={setConsent}>
          Погоджуюся на обробку персональних даних
        </Checkbox>
        <Checkbox name="demo-consent-err" checked={false} onChange={() => {}} error="Потрібна ваша згода">
          Checkbox (error)
        </Checkbox>
        <div className="flex items-center gap-4">
          <Switch checked={sw} onChange={setSw} label="Switch" />
          <Switch checked={false} disabled label="Switch disabled" />
          <span className="text-fg-muted">Switch · on / disabled</span>
        </div>
        <fieldset className="grid gap-2.5 sm:grid-cols-2">
          <legend className="mb-2 font-medium">Choice cards</legend>
          {[
            ["implants", "Немає зуба", "tooth-gap"],
            ["whitening", "Хочу білі зуби", "sparkle"],
            ["aligners", "Криві зуби", "zigzag"],
            ["kids", "Для дитини", "child"],
          ].map(([v, l, ic]) => (
            <ChoiceCard
              key={v}
              name="demo-choice"
              value={v}
              checked={choice === v}
              onChange={setChoice}
              title={l}
              hint="Підказка"
              media={
                <span className="grid size-11 place-items-center rounded-[14px] bg-accent-soft text-accent-soft-fg">
                  <Icon name={ic as "sparkle"} size={22} />
                </span>
              }
            />
          ))}
        </fieldset>
        <Tabs
          label="Tabs demo"
          tabs={[
            { id: "a", label: "Standard", content: <p className="text-fg-muted">Вкладка 1: базовий пакет.</p> },
            { id: "b", label: "Premium", content: <p className="text-fg-muted">Вкладка 2: преміум.</p> },
            { id: "c", label: "Lifetime", content: <p className="text-fg-muted">Вкладка 3: довічна гарантія.</p> },
          ]}
        />
      </div>
    </div>
  );
}
