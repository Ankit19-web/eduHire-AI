export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  starterCodeJava: string;
  solutionJava: string;
  testCases: TestCase[];
  timeComplexityOptimal: string;
  spaceComplexityOptimal: string;
  hints: string[];
}

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum-java',
    title: 'Two Sum (Optimal Hash Map)',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCodeJava: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
        return new int[]{};
    }
}`,
    solutionJava: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}`,
    testCases: [
      { id: 'tc1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', isPublic: true },
      { id: 'tc2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', isPublic: true },
      { id: 'tc3', input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]', isPublic: true },
      { id: 'tc4', input: 'nums = [11,15,2,7], target = 9', expectedOutput: '[2, 3]', isPublic: false },
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(N)',
    hints: [
      'Can you avoid the nested O(N^2) loop by remembering previously seen elements?',
      'A HashMap allows O(1) average lookup for the complement (target - nums[i]).',
      'Check if the complement exists before inserting the current number.',
    ],
  },
  {
    id: 'valid-parentheses-java',
    title: 'Valid Parentheses (Stack)',
    difficulty: 'Easy',
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCodeJava: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
        return false;
    }
}`,
    solutionJava: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
    testCases: [
      { id: 'tc1', input: 's = "()"', expectedOutput: 'true', isPublic: true },
      { id: 'tc2', input: 's = "()[]{}"', expectedOutput: 'true', isPublic: true },
      { id: 'tc3', input: 's = "(]"', expectedOutput: 'false', isPublic: true },
      { id: 'tc4', input: 's = "([)]"', expectedOutput: 'false', isPublic: false },
    ],
    timeComplexityOptimal: 'O(N)',
    spaceComplexityOptimal: 'O(N)',
    hints: [
      'Use a LIFO structure: the most recently opened bracket must be the first to close.',
      'When you see an open bracket, push the expected matching closing bracket.',
      'Check if the stack is completely empty at the end.',
    ],
  },
  {
    id: 'lru-cache-java',
    title: 'LRU Cache Design (Doubly Linked List + Map)',
    difficulty: 'Medium',
    category: 'System Design & Data Structures',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size capacity.
- \`int get(int key)\`: Return the value of the key if key exists, otherwise return -1.
- \`void put(int key, int value)\`: Update or insert the key-value pair. When capacity is reached, evict the least recently used key.

Both get and put operations must run in O(1) average time complexity.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    starterCodeJava: `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
        // Initialize your cache here
    }
    
    public int get(int key) {
        return -1;
    }
    
    public void put(int key, int value) {
        // Implement put
    }
}`,
    solutionJava: `import java.util.*;

class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }
    
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insert(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            remove(tail.prev);
        }
        insert(new Node(key, value));
    }
    
    private void remove(Node node) {
        map.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    private void insert(Node node) {
        map.put(node.key, node);
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`,
    testCases: [
      {
        id: 'tc1',
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        expectedOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        isPublic: true,
      },
    ],
    timeComplexityOptimal: 'O(1) for get and put',
    spaceComplexityOptimal: 'O(Capacity)',
    hints: [
      'A Hash Table gives O(1) lookup, but how do you track ordering in O(1)?',
      'A Doubly-Linked List allows O(1) removal and insertion at head/tail.',
      'Maintain dummy head and dummy tail nodes to eliminate edge-case null checks.',
    ],
  },
];
