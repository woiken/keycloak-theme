import type { JSX } from "keycloakify/tools/JSX";
import { useEffect, Fragment, cloneElement } from "react";
import { assert } from "keycloakify/tools/assert";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
  useUserProfileForm,
  getButtonToDisplayForMultivaluedAttributeField,
  type FormAction,
  type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
  const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

  const { advancedMsg } = i18n;

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword
  });

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable);
  }, [isFormSubmittable]);

  const groupNameRef = { current: "" };

  return (
    <>
      {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
        return (
          <Fragment key={attribute.name}>
            <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
            {BeforeField !== undefined && (
              <BeforeField
                attribute={attribute}
                dispatchFormAction={dispatchFormAction}
                displayableErrors={displayableErrors}
                valueOrValues={valueOrValues}
                kcClsx={kcClsx}
                i18n={i18n}
              />
            )}
            <div
              className="space-y-2"
              style={{
                display:
                  attribute.annotations.inputType === "hidden" ||
                  (attribute.name === "password-confirm" && !doMakeUserConfirmPassword)
                    ? "none"
                    : undefined
              }}
            >
              <Label htmlFor={attribute.name} className="text-sm font-medium">
                {advancedMsg(attribute.displayName ?? "")}
                {attribute.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div>
                {attribute.annotations.inputHelperTextBefore !== undefined && (
                  <p
                    className="text-sm text-muted-foreground mb-2"
                    id={`form-help-text-before-${attribute.name}`}
                    aria-live="polite"
                  >
                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                  </p>
                )}
                <InputFieldByType
                  attribute={attribute}
                  valueOrValues={valueOrValues}
                  displayableErrors={displayableErrors}
                  dispatchFormAction={dispatchFormAction}
                  kcClsx={kcClsx}
                  i18n={i18n}
                />
                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={undefined} />
                {attribute.annotations.inputHelperTextAfter !== undefined && (
                  <p
                    className="text-sm text-muted-foreground mt-2"
                    id={`form-help-text-after-${attribute.name}`}
                    aria-live="polite"
                  >
                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                  </p>
                )}
                {AfterField !== undefined && (
                  <AfterField
                    attribute={attribute}
                    dispatchFormAction={dispatchFormAction}
                    displayableErrors={displayableErrors}
                    valueOrValues={valueOrValues}
                    kcClsx={kcClsx}
                    i18n={i18n}
                  />
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}

function GroupLabel(props: {
  attribute: Attribute;
  groupNameRef: {
    current: string;
  };
  i18n: I18n;
  kcClsx: KcClsx;
}) {
  const { attribute, groupNameRef, i18n } = props;

  const { advancedMsg } = i18n;

  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? "";

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined);

      return (
        <div
          className="space-y-2 pt-4"
          {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
        >
          {(() => {
            const groupDisplayHeader = attribute.group.displayHeader ?? "";
            const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

            return (
              <div>
                <Label id={`header-${attribute.group.name}`} className="text-base font-semibold">
                  {groupHeaderText}
                </Label>
              </div>
            );
          })()}
          {(() => {
            const groupDisplayDescription = attribute.group.displayDescription ?? "";

            if (groupDisplayDescription !== "") {
              const groupDescriptionText = advancedMsg(groupDisplayDescription);

              return (
                <p id={`description-${attribute.group.name}`} className="text-sm text-muted-foreground">
                  {groupDescriptionText}
                </p>
              );
            }

            return null;
          })()}
        </div>
      );
    }
  }

  return null;
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined }) {
  const { attribute, fieldIndex } = props;

  const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

  if (displayableErrors.length === 0) {
    return null;
  }

  return (
    <p
      id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
      className="text-sm text-destructive mt-1"
      aria-live="polite"
    >
      {displayableErrors
        .filter(error => error.fieldIndex === fieldIndex)
        .map(({ errorMessage }, i, arr) => (
          <Fragment key={i}>
            {errorMessage}
            {arr.length - 1 !== i && <br />}
          </Fragment>
        ))}
    </p>
  );
}

type InputFieldByTypeProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: React.Dispatch<FormAction>;
  i18n: I18n;
  kcClsx: KcClsx;
};

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props;

  switch (attribute.annotations.inputType) {
    case "hidden":
      return <input type="hidden" name={attribute.name} value={valueOrValues} />;
    case "textarea":
      return <TextareaTag {...props} />;
    case "select":
    case "multiselect":
      return <SelectTag {...props} />;
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <InputTagSelects {...props} />;
    default: {
      if (valueOrValues instanceof Array) {
        return (
          <>
            {valueOrValues.map((...[, i]) => (
              <InputTag key={i} {...props} fieldIndex={i} />
            ))}
          </>
        );
      }

      const inputNode = <InputTag {...props} fieldIndex={undefined} />;

      if (attribute.name === "password" || attribute.name === "password-confirm") {
        return (
          <PasswordWrapper i18n={props.i18n} passwordInputId={attribute.name}>
            {inputNode}
          </PasswordWrapper>
        );
      }

      return inputNode;
    }
  }
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;

  const { msgStr } = i18n;

  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

  return (
    <div className="relative">
      {cloneElement(children, {
        type: isPasswordRevealed ? "text" : "password",
        className: cn(children.props.className, "pr-10")
      })}
      <button
        type="button"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
      >
        {isPasswordRevealed ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
      </button>
    </div>
  );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
  const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

  const { advancedMsgStr } = i18n;

  return (
    <>
      <Input
        type={(() => {
          const { inputType } = attribute.annotations;

          if (inputType?.startsWith("html5-")) {
            return inputType.slice(6);
          }

          return inputType ?? "text";
        })()}
        id={attribute.name}
        name={attribute.name}
        value={(() => {
          if (fieldIndex !== undefined) {
            assert(valueOrValues instanceof Array);
            return valueOrValues[fieldIndex];
          }

          assert(typeof valueOrValues === "string");

          return valueOrValues;
        })()}
        aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
        disabled={attribute.readOnly}
        autoComplete={attribute.autocomplete}
        placeholder={
          attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
        }
        pattern={attribute.annotations.inputTypePattern}
        maxLength={
          attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
        }
        minLength={
          attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)
        }
        max={attribute.annotations.inputTypeMax}
        min={attribute.annotations.inputTypeMin}
        step={attribute.annotations.inputTypeStep}
        {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
        onChange={event =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: (() => {
              if (fieldIndex !== undefined) {
                assert(valueOrValues instanceof Array);

                return valueOrValues.map((value, i) => {
                  if (i === fieldIndex) {
                    return event.target.value;
                  }

                  return value;
                });
              }

              return event.target.value;
            })()
          })
        }
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: fieldIndex
          })
        }
      />
      {(() => {
        if (fieldIndex === undefined) {
          return null;
        }

        assert(valueOrValues instanceof Array);

        const values = valueOrValues;

        return (
          <>
            <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
            <AddRemoveButtonsMultiValuedAttribute
              attribute={attribute}
              values={values}
              fieldIndex={fieldIndex}
              dispatchFormAction={dispatchFormAction}
              i18n={i18n}
            />
          </>
        );
      })()}
    </>
  );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
  attribute: Attribute;
  values: string[];
  fieldIndex: number;
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
  i18n: I18n;
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

  const { msg } = i18n;

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

  const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

  return (
    <div className="flex items-center gap-2 mt-2">
      {hasRemove && (
        <Button
          id={`kc-remove${idPostfix}`}
          type="button"
          variant="link"
          size="sm"
          className="p-0 h-auto"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: values.filter((_, i) => i !== fieldIndex)
            })
          }
        >
          {msg("remove")}
        </Button>
      )}
      {hasAdd && hasRemove && <span className="text-muted-foreground">|</span>}
      {hasAdd && (
        <Button
          id={`kc-add${idPostfix}`}
          type="button"
          variant="link"
          size="sm"
          className="p-0 h-auto"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""]
            })
          }
        >
          {msg("addValue")}
        </Button>
      )}
    </div>
  );
}

function InputTagSelects(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

  const { inputType } = attribute.annotations;

  assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

  const isCheckbox = inputType === "multiselect-checkboxes";

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations;

      if (inputOptionsFromValidation === undefined) {
        break walk;
      }

      const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

      if (validator === undefined) {
        break walk;
      }

      if (validator.options === undefined) {
        break walk;
      }

      return validator.options;
    }

    return attribute.validators.options?.options ?? [];
  })();

  return (
    <div className="space-y-2">
      {options.map(option => (
        <div key={option} className="flex items-center space-x-2">
          {isCheckbox ? (
            <Checkbox
              id={`${attribute.name}-${option}`}
              name={attribute.name}
              value={option}
              disabled={attribute.readOnly}
              checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
              onCheckedChange={(checked) =>
                dispatchFormAction({
                  action: "update",
                  name: attribute.name,
                  valueOrValues: (() => {
                    if (valueOrValues instanceof Array) {
                      const newValues = [...valueOrValues];

                      if (checked) {
                        newValues.push(option);
                      } else {
                        newValues.splice(newValues.indexOf(option), 1);
                      }

                      return newValues;
                    }

                    return checked ? option : "";
                  })()
                })
              }
            />
          ) : (
            <input
              type="radio"
              id={`${attribute.name}-${option}`}
              name={attribute.name}
              value={option}
              className="h-4 w-4"
              aria-invalid={props.displayableErrors.length !== 0}
              disabled={attribute.readOnly}
              checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
              onChange={event =>
                dispatchFormAction({
                  action: "update",
                  name: attribute.name,
                  valueOrValues: event.target.checked ? option : ""
                })
              }
              onBlur={() =>
                dispatchFormAction({
                  action: "focus lost",
                  name: attribute.name,
                  fieldIndex: undefined
                })
              }
            />
          )}
          <Label
            htmlFor={`${attribute.name}-${option}`}
            className={cn("text-sm font-normal", attribute.readOnly && "opacity-50")}
          >
            {inputLabel(i18n, attribute, option)}
          </Label>
        </div>
      ))}
    </div>
  );
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props;

  assert(typeof valueOrValues === "string");

  const value = valueOrValues;

  return (
    <textarea
      id={attribute.name}
      name={attribute.name}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
      rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
      maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
      value={value}
      onChange={event =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    />
  );
}

function SelectTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;

  const isMultiple = attribute.annotations.inputType === "multiselect";

  const options = (() => {
    walk: {
      const { inputOptionsFromValidation } = attribute.annotations;

      if (inputOptionsFromValidation === undefined) {
        break walk;
      }

      assert(typeof inputOptionsFromValidation === "string");

      const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

      if (validator === undefined) {
        break walk;
      }

      if (validator.options === undefined) {
        break walk;
      }

      return validator.options;
    }

    return attribute.validators.options?.options ?? [];
  })();

  if (isMultiple) {
    // For multiselect, use native select with multiple
    return (
      <select
        id={attribute.name}
        name={attribute.name}
        className="flex h-auto min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-invalid={displayableErrors.length !== 0}
        disabled={attribute.readOnly}
        multiple={true}
        size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
        value={valueOrValues instanceof Array ? valueOrValues : [valueOrValues]}
        onChange={event =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: Array.from(event.target.selectedOptions).map(option => option.value)
          })
        }
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: undefined
          })
        }
      >
        {options.map(option => (
          <option key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </option>
        ))}
      </select>
    );
  }

  // For single select, use shadcn Select
  return (
    <Select
      value={typeof valueOrValues === "string" ? valueOrValues : valueOrValues[0] ?? ""}
      onValueChange={(value) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: value
        })
      }
      disabled={attribute.readOnly}
    >
      <SelectTrigger
        id={attribute.name}
        aria-invalid={displayableErrors.length !== 0}
      >
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </SelectItem>
        ))}
      </SelectContent>
      {/* Hidden input for form submission */}
      <input type="hidden" name={attribute.name} value={typeof valueOrValues === "string" ? valueOrValues : valueOrValues[0] ?? ""} />
    </Select>
  );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n;

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations;

    return advancedMsg(inputOptionLabels[option] ?? option);
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
  }

  return option;
}
