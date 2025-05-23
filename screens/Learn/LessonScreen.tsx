import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app";

// Props from navigation
type LessonScreenProps = NativeStackScreenProps<RootStackParamList, "Lesson">;

// Local lesson data
const lessonData: Record<string, { title: string; content: string }> = {
  bleeding: {
    title: "⛑ ⚚ Bleeding ⚚ ⛑",
    content:
      "1. Apply direct pressure to the wound.\n" +
      "2. Elevate the injured area above heart level.\n" +
      "3. Do not remove embedded objects.\n" +
      "4. Seek medical assistance if bleeding continues.",
  },
  choking: {
    title: "⛑⚚ Choking ⚚⛑",
    content:
      "🌊 Drowning: What You Need to Know\n" + 
      "Imagine this: It’s a perfect summer day, and the water looks calm, inviting. But beneath that serene surface, danger can strike without warning. Drowning happens fast and silently—no dramatic thrashing, no screams for help. Just a quiet struggle for air.\n" +
      "Drowning doesn’t just happen in the ocean. It can occur in pools, lakes, bathtubs, or even shallow water. In fact, a child can drown in just 2 inches of water. That’s less than the depth of a smartphone lying flat! " +
      "Every second counts. In just 4 to 6 minutes without oxygen, the brain can suffer permanent damage. But here’s the good news: You can save a life if you know what to do. \n" +
      "⚠️ Recognizing Drowning Signs\n" +
      "Forget the dramatic movie scenes. In real life, drowning is deceptively quiet. Look for:\n" +
      "Head low in the water, mouth at water level.\n" +
      "Eyes glassy and unfocused, or closed.\n" +
      "Gasping for air or hyperventilating.\n" +
      "Arms pushing down to lift the body, not waving for help.\n" +
      "Trying to roll onto their back.\n" +
      "If you see any of these signs, don’t wait. They need help now.\n" +
      "📖 Real-Life Scenario to Remember\n" +
      "It’s a scorching summer day, and you’re at a crowded beach with your friends. The sun is blazing, kids are laughing, and the waves are crashing rhythmically. You’re scrolling through your phone when a sudden scream pierces the air. Your head snaps up to see a woman frantically pointing at the water." +
      "There, just beyond the breaking waves, a small figure is bobbing up and down, arms flailing. It’s a young boy, his mouth opening and closing, but no sound comes out. He goes under—once, twice. You feel a knot form in your stomach as you realize he’s drowning." +
      "Your heart races, but your mind clears as you remember the steps:\n" +
      "H.E.L.P. – Help, Extract, Lay, Perform CPR." +
      "You shout for someone to call 911 while sprinting to the shoreline. You know the water is rough, and charging in recklessly could put you at risk too. “Don’t become the second victim,” you remind yourself. Spotting a nearby lifeguard, you wave them over, pointing to the boy. The lifeguard dives in, expertly navigating the waves and bringing the boy back to shore." +
      "The boy is pale and limp, his chest eerily still. You kneel beside him, adrenaline pumping. “Check for breathing,” you think. You lean in, your ear hovering above his mouth. Nothing. No rise and fall of his chest." +
      "It’s time to act." + 
      "You lock your hands together and place them in the center of his chest. You start compressions—1, 2, 3… 30—just like you practiced in that first aid class. You tilt his head back, pinch his nose, and give two rescue breaths, watching his chest rise." +
      "People gather around, their faces a mix of fear and hope. But you’re focused. 30 compressions, 2 breaths. Again and again. Suddenly, the boy coughs, water sputtering from his mouth. He gasps, eyes fluttering open. Relief floods through you, but you remember the next step: Recovery Position. You carefully roll him onto his side, making sure his airway is clear." +
      "Moments later, sirens wail as the paramedics arrive. You explain everything you did, from the compressions to the breaths. They take over, commending your quick thinking. As they wheel him away, the boy looks back, his eyes locking with yours. He’s alive because you remembered H.E.L.P." +
      "Please check this video out for CPR, sometimes a 5 minute video might save 5 decades of a person’s life; maybe even yours:  Learn Hands-Only CPR in 60 seconds.\n" +
      "🚨 H.E.L.P. – The 4-Step Lifesaver\n" +
      "Here’s the easy-to-remember plan when someone is drowning:\n" +
      "Help: Call for help. Shout for someone to call 911 or get a lifeguard.\n" +
      "Extract: If safe, get the person out of the water using a floatation device. Don’t jump in unless you’re trained—you could become the second victim.\n" +
      "Lay & Check: Lay them on their back on a flat surface. Check for breathing for no more than 10 seconds.\n" +
      "Perform CPR: If they’re not breathing, start CPR immediately.\n",
  },
  burn: {
    title: "⛑⚚ Burns ⚚⛑\n",
    content:
      "Burns occur when excessive heat damages body tissues. Common sources include the sun, radiation, chemicals, hot liquids, electrical devices, and fire. Understanding burn severity and appropriate first aid is crucial, as burns can range from minor to life-threatening.\n\n" +
      "🔥 TYPES OF BURNS:🔥\n" +
      "- First-Degree Burns: Affect only the outer layer of the skin (epidermis). The area appears red, dry, and is painful but without blisters. Mild sunburn is a typical example.\n"+
      "- Second-Degree Burns: Involve both the epidermis and part of the dermis (the second layer of skin). The burn site appears red, blistered, swollen, and is painful.\n"+
      "- Third-Degree Burns: Extend through all layers of the skin, potentially affecting underlying tissues. The area may look white, charred, or leathery. Surprisingly, third-degree burns might not be painful initially due to nerve damage.\n"+
      "NOW, IMAGINE THIS:\n\n"+
      "⚠️ The Hot Tea Incident ⚠️\n"+
      "You’re at home with your younger sibling, who just learned how to make tea. Excited, they pour boiling water into a cup but accidentally knock it over. The scalding water splashes onto their arm, and they scream in pain.\n"+
      "Panic sets in, but you know you need to act fast. What do you do?\n"+
      "> Your First Thought: Should you grab ice from the freezer or maybe some butter from the fridge to soothe the burn?\n"+
      "> Your Second Thought: Should you remove their soaked sleeve or leave it on?\n"+
      "> Your Third Thought: Should you rush them to the bathroom or call for help immediately?\n"+
      "Take a moment to think about what you’d do.\n\n"+
    
      "🧯Walking Through the Scenario🧯\n"+
      "💧You decide to:💧\n"+
      "> Rush them to the sink and run cool water over the burned area. (Good choice—cool water helps stop the burning process!)\n"+
      "> Gently remove their sleeve before the area swells. (Smart move—clothing can stick to the burn if left on.)\n"+
      "> Cover the burn with a clean cloth while keeping them calm. (Perfect—this protects the area from infection.)\n"+
      "> But then you wonder, should you call for help? Is this serious enough to go to the hospital?\n"+
      "> You remember the burn looks red and blistered but isn’t charred or white. It hurts, but they’re alert and talking. You decide to keep an eye on it and call your parents, just in case.\n\n"+
    
      "📖 What You Did Right 📖\n"+
      "> You didn’t use ice or butter, which could have worsened the injury.\n"+
      "> You cooled the burn with water, helping reduce pain and swelling.\n"+
      "> You protected the burn from dirt and germs by covering it.\n\n"+
      "> What You Could Have Done Better\n"+
      "> 🚑 If the burn were larger or on the face, hands, or joints, calling for medical help immediately would be crucial.\n"+
      "> Watching for signs of infection (like increased redness, swelling, or oozing) is essential in the following days.\n\n"+
    
      "🚨 Lessons Learned and Rules to Follow 🚨\n"+
      "After experiencing this, you learned the importance of the \"SCALD\" mnemonic:\n" +
      "❄️S: Stop the burning process by moving away from the hot water.\n" +
      "❄️C: Cool the burn with running cool water for at least 10 minutes.\n" +
      "❄️A: Apply a clean, non-stick dressing.\n" +
      "❄️L: Leave blisters intact.\n"+
      "❄️D: Don’t use ice, butter, or ointments.\n\n"+
      "This approach helps you remember the steps more effectively, but what about the steps to follow when the burn is not caused by a heat but rather chemical factor or electroshock?\n" 
    
  },
  allergy: {
    title: "⚚ Allergic Reaction ⚚",
    content:
      "1. Use an epinephrine auto-injector if available.\n" +
      "2. Call emergency services immediately.\n" +
      "3. Lay the person down and elevate legs.\n" +
      "4. Loosen tight clothing.",
  },
  drowning: {
    title: "⚚ Drowning ⚚",
    content:
      "1. Call emergency services immediately.\n" +
      "2. Begin CPR if the person isn’t breathing.\n" +
      "3. Turn them on their side to drain water if needed.\n" +
      "4. Stay with the person until help arrives.",
  },
  cardiacemergencies: {
    title: "⚚ Cardiac Emergencies ⚚",
    content:
      "1. Call emergency services immediately.\n" +
      "2. Begin CPR if the person is unresponsive and not breathing.\n" +
      "3. Use an AED if available.\n" +
      "4. Keep the person calm and comfortable.",
  },
  firstaid: {
    title: "⚚ First Aid Kit ⚚",
    content:
      "1. Keep a well-stocked first aid kit at home and in your car.\n" +
      "2. Include items like band-aids, antiseptic wipes, gauze, scissors, and adhesive tape.\n" +
      "3. Regularly check and replace expired items.\n" +
      "4. Know how to use each item in the kit.",
  },
};

const LessonScreen: React.FC<LessonScreenProps> = ({ route, navigation }) => {
  const { topicId } = route.params;
  const lesson = lessonData[topicId];

  const goToQuiz = () => {
    navigation.navigate("Quiz", { topicId });
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Lesson not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.content}>{lesson.content}</Text>

      <TouchableOpacity style={styles.quizButton} onPress={goToQuiz}>
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#F2B28C"},
  title: {
    fontFamily: 'Poppins-Black',
    fontSize: 26,
    marginBottom: 15,
    color: "#780C28",
    textAlign: "center",
  },
  content: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: "#555",
    textAlign: "left",
    marginBottom: 30,
    lineHeight: 28,
  },
  error: { color: "red", fontSize: 16, marginTop: 50 },
  quizButton: {
    backgroundColor: "#780C28",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  quizButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: "#fff",
  },
});
