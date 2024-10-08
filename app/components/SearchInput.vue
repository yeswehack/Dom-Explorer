<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="button">
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="justify-between gap-2 pl-3 pr-1"
          :disabled="readOnly"
        >
          {{
            model
              ? getLabel(_choices.find((choice) => getValue(choice) === model))
              : label
          }}
          <Icon name="chevronsUpDown" class="ml-1 size-5 shrink-0 opacity-50" />
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent class="p-0" :align="align">
      <Command v-model:search-term="searchTerm">
        <CommandInput :placeholder="searchPlaceholder ?? 'Search...'" />
        <CommandEmpty>{{ notFound ?? "Nothing matches..." }}</CommandEmpty>
        <CommandList>
          <template v-for="group of filteredGroups" :key="group.name">
            <CommandGroup :heading="group.name">
              <CommandItem
                v-for="choice of group.items"
                :key="getValue(choice)"
                :value="getValue(choice)"
                @select="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      model = ev.detail.value;
                    }
                    open = false;
                  }
                "
              >
                {{ getLabel(choice) }}
                <Icon
                  name="check"
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      model === getValue(choice) ? 'opacity-100' : 'opacity-0',
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script lang="ts" setup>
import { cn } from "~/utils";

type Choice = { label: string; value: string } | string;

const props = defineProps<{
  label?: string;
  searchPlaceholder?: string;
  notFound?: string;
  align?: "start" | "end" | "center";
  groups?: { name: string; items: Choice[] }[];
  choices?: Choice[];
  readOnly?: boolean;
}>();
const open = ref(false);

const model = defineModel<string>({ default: () => undefined });
const searchTerm = ref("");

const _groups = computed(() => {
  if (props.choices) {
    return [{ name: props.label ?? "", items: props.choices }];
  } else {
    return props.groups ?? [];
  }
});

function getLabel(choice?: { label: string; value: string } | string) {
  if (typeof choice === "undefined") return undefined;
  return typeof choice === "string" ? choice : choice.label;
}

function getValue(choice: { label: string; value: string } | string) {
  return typeof choice === "string" ? choice : choice.value;
}

const _choices = computed(() => {
  return _groups.value.flatMap((g) => g.items);
});

const filteredGroups = computed(() => {
  return _groups.value
    .map((g) => {
      return {
        name: g.name,
        items: g.items.filter((choice) => {
          const label = getLabel(choice);
          return label?.toLowerCase().includes(searchTerm.value.toLowerCase());
        }),
      };
    })
    .filter((g) => g.items.length > 0);
});
</script>
