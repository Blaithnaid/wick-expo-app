import { useState } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AlertCircleIcon } from "@/components/ui/icon";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView, Text, View } from "@/components/Themed";
import { useFirebaseContext } from "@/services/FirebaseProvider";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const auth = useFirebaseContext().myAuth;
  const colorScheme = useColorScheme().colorScheme;
  const [didSubmit, setDidSubmit] = useState(false);

  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  const emailregex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  const handleSubmit = async () => {
    const reset = await sendPasswordResetEmail(auth, email);
    setDidSubmit(true);
  };

  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-1 justify-between">
        {didSubmit ? (
          <View className="mt-64 w-3/4 self-center">
            <FontAwesome
              name="envelope-circle-check"
              size={64}
              color={colorScheme === "dark" ? "white" : "black"}
              className="self-center"
            />
            <Text className="mt-4 text-lg text-center">
              If an account with the provided email address
              exists, a password reset link has been sent to it.
            </Text>
          </View>
        ) : (
          <View className="pt-32 px-8">
            <FormControl
              isInvalid={isEmailInvalid}
              size="md"
              isRequired={true}
            >
              <FormControlLabel>
                <FormControlLabelText className="dark:text-white">
                  Email
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                className="my-1 rounded-lg bg-slate-700"
                size={"md"}
              >
                <InputField
                  className="text-black dark:text-white"
                  type="text"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (!emailregex.test(email)) {
                      setIsEmailInvalid(true);
                    } else {
                      setIsEmailInvalid(false);
                    }
                  }}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  Enter the email address associated with your
                  account.
                </FormControlHelperText>
              </FormControlHelper>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Email is invalid.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            <Button
              className="w-fit bg-iguana-500 self-end mt-4"
              size="md"
              onPress={() => {
                handleSubmit();
              }}
            >
              <ButtonText className="text-black dark:text-white">
                Send
              </ButtonText>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
