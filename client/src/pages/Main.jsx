import React from "react";
import {
  Heading,
  HStack,
  IconButton,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Badge
} from "@chakra-ui/react";
import { TextEntry } from "../components/TextEntry";
import { AiOutlineGithub, AiOutlineInfoCircle } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs'

export function Main() {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack h="100vh" justify="space-between">
      <Heading
        m="none"
        p="30px"
        bg="linear-gradient(137deg, rgba(61,112,104,1) 0%, rgba(20,69,61,1) 100%)"
        textAlign="center"
        color="white"
        shadow="2px 2px 10px darkgray"
        fontSize="5xl"
      >
        Microaggression Detector
      </Heading>
      <TextEntry />
      <HStack justify="space-between" p="10px" bg="linear-gradient(137deg, rgba(61,112,104,1) 0%, rgba(20,69,61,1) 100%)">
        <HStack color='#F0E8D1'>
          <BsPersonCircle fontSize='18pt'/>
          <Text pr='20px'>Kaleb Chisholm, Sean Jamieson, Mark Alwast, Matt Bardal, Kasi Viswanath Nilla</Text>
          <AiOutlineGithub fontSize='20pt'/>
          <a href="https://github.com/kalebchisholm/microaggressions.git">Github Repository</a>
        </HStack>
        <IconButton
          variant="ghost"
          borderRadius='full'
          icon={
            <AiOutlineInfoCircle fontSize="28pt" color="#F0E8D1"/>
          }
          _hover={{bg: 'none', shadow: '2px 2px 10px darkgray'}}
          onClick={onOpen}
        />
        <InfoModal isOpen={isOpen} onClose={onClose}/>
      </HStack>
    </Stack>
  );
}

const InfoModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} motionPreset='slideInBottom' isCentered>
      <ModalOverlay />
      <ModalContent bg='rgba(61,112,104,1)' color='white' borderRadius='xl'>
        <ModalHeader>About Microaggression Detector</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>
            This microaggression detector uses various machine learning models in order to determine (1) whether or not the inputted text is a microaggression, and (2) what category of microaggression it falls under. Currently, the models supports 7 categories of microaggressions, with hopes of adding more in the future.
          </Text>
          <Text fontSize='md' fontWeight='bold' mt='10px'>Disclaimer</Text>
          <Text>
            If you enter a microaggression that does not fall under one of the seven categories below, there is a high probability the model may misclassify it as not a microaggression or as a microaggression of an incorrect category.
          </Text>
          <Text fontSize='xl' fontWeight='bold' mt='10px'>Microaggression Types Supported:</Text>
          <HStack justify='space-evenly' mt='20px'>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Age</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Body</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Disability</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Gender</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>LGBTQ+</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Race</Badge>
            <Badge bg='#F0E8D1' borderRadius='lg' px='5px' py='2px'>Religion</Badge>
            
          </HStack> 
        </ModalBody>
        <ModalFooter>
          <Button
              onClick={props.onClose}
              border="2px solid black"
              shadow="2px 2px 10px rgba(20,69,61,1)"
              borderRadius="full"
              bg="#E36372"
              color='black'
              _hover={{ bg: "#ED97A1", shadow: 'none' }}
            >
              Close
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}